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
import * as https from 'https';
import axios from 'axios';
@WebSocketGateway({ cors: true, path: '/chat', methods: ['GET', 'POST'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	usersArray = [];
	peerConnections: { [userId: string]: RTCPeerConnection } = {};
	BASEAPIURL = process.env.HOST;
    UPLOAD_API_URL = process.env.HOST + 'upload';

	private connectedUsers: Map<string, Socket> = new Map();
	constructor(
		private readonly chatService: ChatService,
		private readonly authService: AuthService,
		private readonly channelService: ChannelService,
		private readonly userService: UserService,
		private readonly notificationService: NotificationService,
		private readonly friendService: FriendService,
		private readonly mutedService: MuteService,
	) { }

	handleConnection(client: Socket) {
		this.GuardsConsumer(client);
		const userName = String(client.handshake.query.userName);
		this.connectedUsers.set(userName, client);
		this.usersArray.push(client.id);
		client.emit('update-user-list', { userIds: this.usersArray });
		const mapObject = [];
		this.connectedUsers.forEach((value, key) => {
			// mapObject[key] = value.id;
			const field = {
				name: key,
				id: value.id
			}
			mapObject.push(field)
		});
		// console.log(mapObject)
		this.server.emit('update-user-list', mapObject);
	}

	handleDisconnect(client: Socket) {
		// //console.log('A user disconnected');
		this.usersArray = this.usersArray.filter(id => id !== client.id);
		client.broadcast.emit('update-user-list', { userIds: this.usersArray });
		// client.broadcast.emit('user-disconnected', { userId: client.id });
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
				await this.chatService.addMessage(payload);
			}
			else
				await this.chatService.addMessage(payload)
			client.emit('message', payload);
		}
		//   this.server.emit('message', payload);
	}

	@SubscribeMessage('inviteOneVsOne')
	async handleInviteOneVsOne(client: Socket, payload: any): Promise<void> {
		// console.log('inviteOneVsOne: ', payload)
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

	@SubscribeMessage("declineGameRequest")
	async handleDeclineGameRequest(client: Socket, payload: any): Promise<void> {
		// console.log('declineGameRequest: ', payload)
		const notif = await this.notificationService.createNotification({
			target: payload.target,
			type: NotificationType.ONEVSONE_DECLINED,
			issuer: payload.issuer,
			message: "",
			image: null,
			audio: null,
			channel: null
		});
		const lastnotif = await this.notificationService.getNotificationById(notif.id);
		const target = this.connectedUsers.get(lastnotif.target.username);
		target?.emit('gameRequestDeclined', lastnotif);
	}
	
	@SubscribeMessage("iCallUser")
	async handleBeginCall(client: Socket, payload: any) {
		client.emit('iAmCallingAUser', payload)
	}
	// ================================ Channel hevents ====================================================================

	@SubscribeMessage('leavChannel')
	async handleLeaveChannel(socket: Socket, payload: any): Promise<void> {
		socket.leave(payload.channelId);
		await this.chatService.leaveFromChannel(payload);
		const channelMembers = await this.channelService.getMembersOfChannel(payload.channelId);
		channelMembers.forEach(async (member: any) => {
			if (this.connectedUsers.has(member.user.username)) {
				this.connectedUsers.get(member.user.username).emit('userLeft', {
					members:channelMembers,
					payload
				});
			}
		});
		socket.emit('userLeft', {
			members:channelMembers,
			payload
		});
	}

	@SubscribeMessage('changePicture')
	async handleChangePicture(client: Socket, payload: any): Promise<void> {
		const mimeType = `image/jpg`;
		const file = new File([payload.picture], `picture.jpg`, { type: mimeType });
		const url = await this.uploadFile(file);
		const user = await this.userService.updatePicture(payload.userId, url);
		client.emit('userUpdated', user);
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
		const isJoined = await this.channelService.isUserInChannel(payload.__owner__, payload.id, );
		if (isJoined)
			return;
		if (channel.password !== null && channel.password !== "") {
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
		const members = await this.channelService.getMembersOfChannel(payload.channelId);
		members.forEach((member: any) => {
			if (this.connectedUsers.has(member.user.username)) {
				this.connectedUsers.get(member.user.username).emit('newMemberJoined', {
					members,
					payload
				});
			}
		});
		this.connectedUsers.get(payload.issuer?.username)?.emit('channelJoined', members);
		this.connectedUsers.get(payload.__owner__?.username)?.emit('channelJoined', members);
		this.connectedUsers.get(payload?.userName)?.emit('channelJoined', members);
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
		const targetFriends = await this.friendService.getFriendsOfUser(payload.friendId);
		const issuerFriends = await this.friendService.getFriendsOfUser(payload.userId);
		this.connectedUsers.get(lastnotif.target.username)?.emit('updatedFriends', targetFriends);
		this.connectedUsers.get(lastnotif.issuer.username)?.emit('updatedFriends', issuerFriends);
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
		members.forEach((member: any) => {
			if (this.connectedUsers.has(member.user.username)) {
				this.connectedUsers.get(member.user.username).emit('userKicked', members);
			}
		});
		// socket?.emit('userKicked', members);
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

	@SubscribeMessage("isUserOnline")
	async isUserOnline(client: Socket, payload: any): Promise<void> {
		// console.log(payload.userName)
		const user = this.connectedUsers.get(payload.userName);
		if (user) {
			client.emit("userIsOnline", true);
		}
		else {
			client.emit("userIsOnline", false);
		}
	}

	@SubscribeMessage('banUser')
	async handleBanUser(client: Socket ,payload: any): Promise<void> {
		client.leave(payload.channelId);
		await this.chatService.banUser(payload);
	}

	@SubscribeMessage('promoteUser')
	async handlePromteUser(client: Socket ,payload: any): Promise<void> {
		await this.chatService.promoteUser(payload);
	}

	// ============================== USER  events ===================================================================

	@SubscribeMessage("updateUser")
	async handleUpdateUser(client: Socket, payload: any): Promise<void> {
		const user = await this.userService.updateUserSetting(payload.userID, {
			firstName: payload.firstName,
			lastName: payload.lastName,
			email: payload.email
		});
		client.emit("userUpdated", user);
	}

	// ============================== Vedio call events ===================================================================

	@SubscribeMessage('callUser')
	async handleCallUser(client: Socket, payload: any) {
		// console.log('callUser: ', payload)
		// client.to(payload.to).emit('RequestCall', {
		// 	from: payload.from,
		// 	// offer: payload.offer,
		// 	senderId: payload.senderId,
		// 	recieverId: payload.recieverId
		// });
		const notif = await this.notificationService.createNotification({
			target: payload.recieverId,
			type: NotificationType.CALL_REQUEST,
			issuer: payload.senderId,
			message: "",
			image: null,
			audio: null,
			channel: null,
			seen: true,
			read: true
		});
		const lastnotif = await this.notificationService.getNotificationById(notif.id);
		this.connectedUsers.get(lastnotif.target.username)?.emit('RequestCall', lastnotif);
	}

	@SubscribeMessage('mediaOffer')
	async handleOnMediaOffer(client: Socket, payload: any) {
		// const {to, from, fromUsername, toUsername} = payload;
		// console.log("to", to)
		// console.log("from", from)
		// console.log("toUsername", toUsername)
		// console.log("fromUsername", fromUsername)
		// console.log({
		// 	fromUsername: payload.fromUsername,
		// 	// offer: payload.offer,
		// 	toUsername: payload.toUsername
		// })
		client.to(payload.to).emit('mediaOffer', {
			from: payload.from,
			offer: payload.offer
		});
	};

	@SubscribeMessage('mediaAnswer')
	async handleOnMediaAnswer(client: Socket, payload: any) {
		const {from, to} = payload;
		//console.log("mediaAnswer:", from, to)
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

	@SubscribeMessage("acceptVideoCall")
	async handleAcceptVideoCall(client: Socket, payload: any) {
		client.to(this.connectedUsers.get(payload.caller.username).id).emit("callPermission", {
			user: payload.user,
			caller: payload.caller,
			permission: payload.permission,
			selectedUser: this.connectedUsers.get(payload.caller.username).id
		})
		client.emit("callPermission", 
			{
				user: payload.user,
				caller: payload.caller,
				permission: payload.permission,
				selectedUser: this.connectedUsers.get(payload.caller.username).id
			}
		)
	}
	@SubscribeMessage("callRejected")
	async handleCallRejected(client: Socket, payload: any) {
		client.to(this.connectedUsers.get(payload.caller.username).id).emit("callRejected", payload)
		client.emit("callRejected", payload)
	}
	@SubscribeMessage("callVideoEnded")
	async handleCallVideoEnd(client: Socket, payload: any) {
		client.to(this.connectedUsers.get(payload.opponnet).id).emit("callVideoEnded", true)
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

	async uploadFile(file: File) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(this.UPLOAD_API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
			// console.log('response: ', response)
            return response.data.url;
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
}
