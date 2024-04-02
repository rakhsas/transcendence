// src/chat/chat.gateway.ts
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
// import cli from '@angular/cli';
// import { Paths } from '../../../frontend/src/utils/types';

// @WebSocketGateway()

// connectionStateRecovery();
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
		private readonly notificationService: NotificationService
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

		// console.log('A user disconnected');
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
			console.log('toUserSocket: ', payload.message);
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
				});
				const lastnotif = await this.notificationService.getNotificationById(notif.id);
				toUserSocket.emit('directMessageNotif', {
					lastnotif
				})
				await this.chatService.addMessage(payload)
			}
			else
				await this.chatService.addMessage(payload)
			client.emit('message', payload);
		}
		//   this.server.emit('message', payload);
	}



	// =============================== Handle Muted users from a channel ============================

	@SubscribeMessage('muteUser')
	async handleMuteEvent(payload: any): Promise<void> {
		await this.chatService.muteUser(payload);
	}

	// ================================ Channel hevents ====================================================================

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
		console.log('acceptJoinChannel: ', payload)
		const channel = await this.chatService.getChannel(payload.id);
		if (channel.password !== null && channel.password !== "") {
			console.log(channel.password, payload.password)
			if ("password" in payload && channel.password === payload.password) {
				client.join(payload.id);
				await this.chatService.addNewMemberToChannel(payload, "");
			}
			else if ("password" in payload && channel.password !== payload.password) {
				client.emit("channelPasswordInvalid", "Cannot join the room (incorrect password)");
				return;
			}
		} else {
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
			console.log('payload: ', payload.__owner__)
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
					message: payload.channelName,
					image: payload.image ? payload.image : null,
					audio: payload.audio? payload.audio : null,
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
		console.log('channelMessages: ', payload)
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
					});
				}
			}
		});
	}
	@SubscribeMessage('changeChannelType')
	async handleChangeChannelType(payload: any): Promise<void> {
		await this.chatService.changeChannelType(payload);
	}
	
	// ====================== User function ===================================================

	@SubscribeMessage('kickTheUser')
	async handleKickUserFromChannel(socket: Socket, payload: any): Promise<void> {
		// in this event handler i am excpected to get the id of the user to
		// kick and the id of the channe from where the user will be kicked.
		socket.leave(payload.channelId);
		await this.chatService.kickUserFromChannel(payload);
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
		client.to(payload.to).emit('RequestCall', {
			from: payload.from,
			offer: payload.offer,
			senderId: payload.senderId,
			recieverId: payload.recieverId
		});
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
		console.log('acceptCall');
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
