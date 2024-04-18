import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/user/entities/channel_member.entity';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/model/user.model';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/user/entities/notification.entity';
import { FriendService } from 'src/friends/friends.service';
import { MuteService } from 'src/mute/mute.service';
@WebSocketGateway({ cors: true, path: '/chat', methods: ['GET', 'POST'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	usersArray = [];
	peerConnections: { [userId: string]: RTCPeerConnection } = {};

	private connectedUsers: Map<string, Socket> = new Map();
	constructor(
		private readonly chatService: ChatService,
		private readonly authService: AuthService,
		private readonly channelService: ChannelService,
		private readonly userService: UserService,
		private readonly notificationService: NotificationService,
		private readonly friendService: FriendService,
		private readonly mutedService: MuteService
	) { }

	handleConnection(client: Socket) {
		this.GuardsConsumer(client);
		const userName = String(client.handshake.query.userName);
		this.connectedUsers.set(userName, client);
		this.usersArray.push(client.id);
		client.emit('update-user-list', { userIds: this.usersArray });
		this.server.emit('update-user-list', { userIds: this.usersArray });
	}

	handleDisconnect(client: Socket) {
		if (this.peerConnections[client.id]) {
			this.peerConnections[client.id].close();
			delete this.peerConnections[client.id];
		}

		// //console.log('A user disconnected');
		this.usersArray = this.usersArray.filter(id => id !== client.id);
		client.broadcast.emit('update-user-list', { userIds: this.usersArray });
		client.broadcast.emit('user-disconnected', { userId: client.id });
		const userName = String(client.handshake.query.userName);
		this.connectedUsers.delete(userName);
	}

	// ============================ messages functions ===============================================================

	@SubscribeMessage('message')
	async handleMessage(client: Socket, payload: any): Promise<void> {
		// you can put the blocked code here {if they are blocked they can't send messages}.
		// if (await this.chatService.areUsersBlocked(payload.to, payload.from) === true)
		// 	return;
		if (payload.hasOwnProperty('recieverName')) {
			const recieverName = String(payload.recieverName);
			const toUserSocket = this.connectedUsers.get(recieverName);
			//console.log('toUserSocket: ', payload.message);
			if (toUserSocket) {
				toUserSocket.emit('message', {
					"to": payload.to,
					"from": payload.from,
					"message": payload.message,
					"image": payload.image,
					"audio": payload.audio,

					// "isOwner": false
				});
				const notif = await this.notificationService.createNotification({
					target: payload.to,
					type: NotificationType.MESSAGE,
					issuer: payload.from,
					message: payload.message,
					image: payload.image ? payload.image : null,
					audio: payload.audio? payload.audio : null,
					channel: null
				});
				const lastnotif = await this.notificationService.getNotificationById(notif.id);
				toUserSocket.emit('directMessageNotif', lastnotif)
				await this.chatService.addMessage(payload)
			}
			else
				await this.chatService.addMessage(payload)
			client.emit('message', payload);
		}
		//   this.server.emit('message', payload);
	}

	@SubscribeMessage('inviteOneVsOne')
	async handleInviteOneVsOne(client: Socket, payload: any): Promise<void> {
		//console.log('inviteOneVsOne: ', payload)
		const areFriends = await this.friendService.getFriendship(payload.userId, payload.friendId);
		//console.log('areFriends: ', areFriends)
		if (areFriends === true)
		{
			const notif = await this.notificationService.createNotification({
				target: payload.friendId,
				type: NotificationType.ONEVSONE,
				issuer: payload.userId,
				message: "",
				image: null,
				audio: null,
				channel: null
			});
			const lastnotif = await this.notificationService.getNotificationById(notif.id);
			const target = this.connectedUsers.get(lastnotif.target.username);
			target?.emit('invitedGame', lastnotif);
		}
	}

	// =============================== Handle Muted users from a channel ============================

	

	// ================================ Channel hevents ====================================================================

	@SubscribeMessage('leavChannel')
	async handleLeaveChannel(socket: Socket, payload: any): Promise<void> {
		socket.leave(payload.channelId);
		await this.chatService.leaveFromChannel(payload);
	}



	@SubscribeMessage('createChannel')
	async handleCreateChannel(socket: Socket, payload: any): Promise<void> {
		socket.join(payload.channelId);
		const newChannel = await this.chatService.addNewChannelEntity(payload);
		await this.chatService.addNewMemberToChannel(newChannel, UserRole.OWNER);
		const updatedChannels = await this.channelService.getChannelsByUserId(payload.ownerId);
		socket.emit('channelCreated', updatedChannels);
		const users = await this.userService.findAllUsers();
		users.forEach(async (user) => {
			if (this.connectedUsers.has(user.username)) {
				const protectedChannels = await this.channelService.getProtectedChannelsExpectUser(user.id);
				const publicchannels = await this.channelService.getPublicChannelsExpectUser(user.id);
				this.connectedUsers.get(user.username).emit('publicChannels', publicchannels);
				this.connectedUsers.get(user.username).emit('protectedChannels', protectedChannels);
			}
		});
	}

	@SubscribeMessage('acceptJoinChannel')
	async handleAcceptJoinChannel(client: Socket, payload: any): Promise<void> {
		//console.log('acceptJoinChannel: ', payload)
		const channel = await this.chatService.getChannel(payload.id);
		//console.log("channel: ", channel)
		if (channel.password !== null && channel.password !== "") {
			//console.log(channel.password, payload.password)
			if ("password" in payload && channel.password === payload.password) {
				client.join(payload.id);
				await this.chatService.addNewMemberToChannel(payload, "");
			}
			else if ("password" in payload && channel.password !== payload.password) {
				client.emit("channelPasswordInvalid", "Cannot join the room (incorrect password)");
				return;
			}
		} else 
		{
			client.join(payload.channelId);
			await this.chatService.addNewMemberToChannel(payload, "");
		}
		// client.emit('channelJoined', payload.__owner__);
		const members = await this.channelService.getMembersOfChannel(payload.channelId);
		client.emit('channelJoined', members);
		if (channel.type === 'protected') {
			const ProtectedChannelsMembers = await this.channelService.getProtectedChannelsExpectUser(payload.__owner__);
			client.emit('protectedChannels', ProtectedChannelsMembers);
		}
		else if (channel.type === 'public') {
			const PublicChannelsMembers = await this.channelService.getPublicChannelsExpectUser(payload.__owner__);
			client.emit('publicChannels', PublicChannelsMembers);
		}
	}

	@SubscribeMessage('joinChannel')
	async handleJoinChannel(client: Socket, payload: any): Promise<void> {
		try {
			//console.log('payload: ', payload.__owner__)
			if (await this.chatService.isJoined(payload.id, payload.__owner__) === true)
			{
				client.emit("joinedError", {
					userId: payload.__owner__,
				})
			}
			else
			{
				const notif = await this.notificationService.createNotification({
					target: payload.__owner__,
					type: NotificationType.CHANNEL_INVITE,
					issuer: payload.requestedUserId,
					message: "",
					image: payload.image ? payload.image : null,
					audio: payload.audio? payload.audio : null,
					channel: payload.id
				});
				const lastnotif = await this.notificationService.getNotificationById(notif.id);
				this.connectedUsers.get(payload.userName).emit('channelJoinNotif', {lastnotif, payload});
			}
		} catch (error) {
			client.emit('channelError', error);
		}
	}

	@SubscribeMessage('channelMessages')
	async handleEvent(socket: Socket, payload: any): Promise<void> {
		//console.log('channelMessages: ', payload)
		const channelMembers = await this.channelService.getMembersOfChannel(payload.cid);
		const message = await this.chatService.addMessage(payload);
		channelMembers.forEach(async (member: any) => {
			if (member.user.id !== payload.senderId) {
				if (this.connectedUsers.has(member.user.username)) {
					this.connectedUsers.get(member.user.username).emit('channelMessage', 
					message);
					const notif = await this.notificationService.createNotification({
						target: member.user.id,
						type: NotificationType.CHANNEL_MESSAGE,
						issuer: payload.senderId,
						message: payload.message,
						image: payload.image ? payload.image : null,
						audio: payload.audio? payload.audio : null,
						channel: payload.channelId
					});
					const lastnotif = await this.notificationService.getNotificationById(notif.id);
					this.connectedUsers.get(member.user.username).emit('roomMessageNotif', lastnotif);
				}
				else {
					await this.notificationService.createNotification({
						target: member.user.id,
						type: NotificationType.CHANNEL_MESSAGE,
						issuer: payload.senderId,
						message: payload.message,
						image: payload.image ? payload.image : null,
						audio: payload.audio? payload.audio : null,
						channel: payload.channelId
					});
				}
			}
		});
	}

	@SubscribeMessage('friendRequest')
	async handleFriendRequest(client: Socket, payload: any): Promise<void> {
		const areFriends = await this.friendService.getFriendship(payload.userId, payload.friendId);
		if (!areFriends)
		{
			const notif = await this.notificationService.createNotification({
				target: payload.friendId,
				type: NotificationType.FRIEND_REQUEST,
				issuer: payload.userId,
				message: "",
				image: null,
				audio: null,
				channel: null
			});
			const lastnotif = await this.notificationService.getNotificationById(notif.id);
			const target = this.connectedUsers.get(lastnotif.target.username);
			target?.emit('friendRequestNotif', lastnotif);
		}
	}
	
	@SubscribeMessage('declineFriendRequest')
	async handleDeclineFriendRequest(client: Socket, payload: any): Promise<void> {
		const notif = await this.notificationService.createNotification({
			target: payload.friendId,
			type: NotificationType.FRIEND_REQUEST_DECLINED,
			issuer: payload.userId,
			message: "",
			image: null,
			audio: null,
			channel: null
		});
		const lastnotif = await this.notificationService.getNotificationById(notif.id);
		this.connectedUsers.get(lastnotif.target.username)?.emit('friendRequestDecinedNotif', lastnotif);
	}

	@SubscribeMessage('acceptFriendRequest')
	async handleAcceptFriendRequest(client: Socket, payload: any): Promise<void> {
		const notif = await this.notificationService.createNotification({
			target: payload.friendId,
			type: NotificationType.FRIEND_REQUEST_ACCEPTED,
			issuer: payload.userId,
			message: "",
			image: null,
			audio: null,
			channel: null,
		});
		await this.friendService.createFriendship(payload.userId, payload.friendId);
		const lastnotif = await this.notificationService.getNotificationById(notif.id);
		const friends = await this.friendService.getFriendsOfUser(payload.friendId);
		this.connectedUsers.get(lastnotif.target.username)?.emit('updatedFriends', friends);
		this.connectedUsers.get(lastnotif.target.username)?.emit('friendRequestAcceptedNotif', lastnotif);
		// await this.notificationService.updateNotificationState(notif.id, {seen: true});
		
	}

	@SubscribeMessage('changeChannelType')
	async handleChangeChannelType(payload: any): Promise<void> {
		await this.chatService.changeChannelType(payload);
	}
	
	// ====================== User function ===================================================

	@SubscribeMessage('blockUser')
	async handleBlockUser(client: Socket, payload: any): Promise<void>
	{
		//console.log('blockUser: ', payload)
		await this.chatService.blockUser(payload);
		client.emit('userBlocked', payload);
	}
	/*
	  	async blockUser(userId: string , blockedUserId: string): Promise<Blocked>
		{
			// the userId and the id the user you want to block
			const newRecord = this.blockRespository.create({
				user: {id: payload.userId},
				blockedUser: {id: payload.blockTargetedId}
			});

			return this.blockR
		}
	*/
	@SubscribeMessage('kickTheUser')
	async handleKickUserFromChannel(socket: Socket, payload: any): Promise<void> {
		// in this event handler i am excpected to get the id of the user to
		// kick and the id of the channe from where the user will be kicked.
		socket.leave(payload.channelId);
		await this.chatService.kickUserFromChannel(payload);
		const members = await this.channelService.getMembersOfChannel(payload.channelId);
		socket?.emit('userKicked', members);
		const notif = await this.notificationService.createNotification({
			target: payload.target,
			type: NotificationType.KIKED,
			issuer: payload.userId,
			message: "",
			image: null,
			audio: null,
			channel: payload.channelId,
		});
		const lastnotif = await this.notificationService.getNotificationById(notif.id);
		this.connectedUsers.get(lastnotif.target.username)?.emit('kickedNotif', lastnotif);
	}

	@SubscribeMessage('checkUsername')
	async handleCheckUsername(client: Socket, payload: any): Promise<void> {
		const user = await this.userService.findByUserName(payload.username);
		console.timeLog('user: ', user)
		if (user) {
			client.emit('usernameExist', "Exist");
		}
		else {
			client.emit('usernameNotExist', null);
		}
	}
	@SubscribeMessage('updateUsername')
	async handleUpdateUsername(client: Socket, payload: any) {
		//console.log('updateUsername: ', payload)
		const newUser = await this.userService.updateUsername(payload.username, payload.userId);
		client.emit('usernameUpdated', newUser);
	}


	@SubscribeMessage('muteUser')
	async handleMuteEvent(socket: Socket, payload: any): Promise<void> {
		await this.chatService.muteUser(payload);
		const mutedUsers = await this.mutedService.getMutedUsers(payload.channelId);
		this.connectedUsers.get(payload.username)?.emit('userMuted', mutedUsers);
	}
	/*
	expected payload:
	{
		channelId: the channel from where the user will be banned.
		userId: the user should be banned.
	}
	*/
	@SubscribeMessage('banUser')
	async handleBanUser(client: Socket ,payload: any): Promise<void> {
		client.leave(payload.channelId);
		await this.chatService.banUser(payload);
	}

	@SubscribeMessage('promoteUser')
	async handlePromteUser(payload: any): Promise<void> {
		await this.chatService.promoteUser(payload);
	}
	// ============================== Vedio call events ===================================================================

	@SubscribeMessage('callUser')
	async handleCallUser(client: Socket, payload: any) {
		console.log('callUser: ', payload)
		client.to(payload.to).emit('RequestCall', {
			from: payload.from,
			// offer: payload.offer,
			senderId: payload.senderId,
			recieverId: payload.recieverId
		});
		console.log({
			from: payload.from,
			// offer: payload.offer,
			senderId: payload.senderId,
			recieverId: payload.recieverId
		})
		const notif = await this.notificationService.createNotification({
			target: payload.target,
			type: NotificationType.CALL_REQUEST,
			issuer: payload.senderId,
			message: "",
			image: null,
			audio: null,
			channel: null,
		});
		const lastnotif = await this.notificationService.getNotificationById(notif.id);
		this.connectedUsers.get(lastnotif.target.username)?.emit('callNotif', lastnotif);
	}

	@SubscribeMessage('mediaOffer')
	async handleOnMediaOffer(client: Socket, payload: any) {
		client.to(payload.to).emit('mediaOffer', {
			from: payload.from,
			offer: payload.offer
		});
	};

	@SubscribeMessage('mediaAnswer')
	async handleOnMediaAnswer(client: Socket, payload: any) {
		client.to(payload.to).emit('mediaAnswer', {
			answer: payload.answer,
			from: payload.from
		});

	}

	@SubscribeMessage('iceCandidate')
	async handleIceCandidate(client: Socket, payload: any) {
		client.to(payload.to).emit('remotePeerIceCandidate', {
			candidate: payload.candidate,
			client: client.id
		});
	}



	@SubscribeMessage('acceptCall')
	async handleAcceptCall(client: Socket, payload: any) {
		//console.log('acceptCall');
		client.to(payload.to).emit('AcceptCall', {
			answer: payload.answer,
			from: payload.from
		});
	}


	async GuardsConsumer(client: Socket): Promise<string> {
		const cookies = client.handshake.headers.cookie?.split(';');
		let access_token;
		for (let index = 0; index < cookies.length; index++) {
			const cookie = cookies[index].trim();
			if (cookie.startsWith('access_token=')) {
				access_token = cookie.substring(String('access_token=').length);
			}
		}
		const payload = await this.authService.validateTokenId(access_token);
		if (!payload) {
			client.disconnect();
		}
		return payload.id
	}
}
