// src/chat/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'src/auth/auth.service';
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
  ) {}

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
    this.usersArray = this.usersArray.filter((id) => id !== client.id);
    client.broadcast.emit('update-user-list', { userIds: this.usersArray });
    client.broadcast.emit('user-disconnected', { userId: client.id });
    const userName = String(client.handshake.query.userName);
    this.connectedUsers.delete(userName);
  }

  // ============================ messages functions ===============================================================

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    // you can put the blocked code here {if they are blocked they can't send messages}.
    if (
      (await this.chatService.areUsersBlocked(payload.to, payload.from)) ===
      true
    )
      return;
    if (payload.hasOwnProperty('recieverName')) {
      const recieverName = String(payload.recieverName);
      const toUserSocket = this.connectedUsers.get(recieverName);
      console.log('toUserSocket: ', payload.message);
      if (toUserSocket) {
        toUserSocket.emit('message', {
          to: payload.to,
          from: payload.from,
          message: payload.message,
          image: payload.image,
          audio: payload.audio,
          // "isOwner": false
        });
        toUserSocket.emit('directMessageNotif', {
          to: payload.to,
          from: payload.from,
          senderId: payload.senderId,
          recieverId: payload.recieverId,
          message: payload.message,
        });
        await this.chatService.addMessage(payload);
      } else await this.chatService.addMessage(payload);
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
    // here the payload must containe the id of the user who create the channel so it can be set as owner
    // create a new entity in the database (new channel)
    // add new entity in user channel relation the user must set as owner

    // if the channel is protected we must first check for the password is correct or not.!

    if ('password' in payload && payload.password != '') {
      console.log('password exist and its not empty :)');
    }

    socket.join(payload.channelId);
    await this.chatService.addNewChannelEntity(payload);

    await this.chatService.addNewMemberToChannel(payload);
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, payload: any): Promise<void> {
    // the payload should contain the channel ID,
    const channel = await this.chatService.getChannel(payload.channelId);
    if (channel.password !== null && channel.password !== '') {
      if ('password' in payload && channel.password === payload.password) {
        client.join(payload.channelId);
        await this.chatService.addNewMemberToChannel(payload);
      } else {
        client.emit(
          'wrongPassowrd',
          'Cannot join the room (incorrect password)',
        );
      }
    } else {
      client.join(payload.channelId);
      await this.chatService.addNewMemberToChannel(payload);
    }
  }

  @SubscribeMessage('channelMessages')
  async handleEvent(socket: Socket, payload: any): Promise<void> {
    this.server.to(payload.cid).emit('channelMessage', {
      cid: payload.cid,
      message: payload.message,
      from: payload.senderId,
      image: payload.image,
    });
    await this.chatService.addMessage(payload);
  }

  @SubscribeMessage('kickTheUser')
  async handleKickUserFromChannel(socket: Socket, payload: any): Promise<void> {
    // in this event handler i am excpected to get the id of the user to
    // kick and the id of the channe from where the user will be kicked.
    socket.leave(payload.channelId);
    await this.chatService.kickUserFromChannel(payload);
  }

  @SubscribeMessage('changeChannelType')
  async handleChangeChannelType(payload: any): Promise<void> {
    await this.chatService.changeChannelType(payload);
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
      recieverId: payload.recieverId,
    });
  }

  @SubscribeMessage('mediaOffer')
  async handleOnMediaOffer(client: Socket, payload: any) {
    // console.log(payload)
    client.to(payload.to).emit('mediaOffer', {
      from: payload.from,
      offer: payload.offer,
    });
  }

  @SubscribeMessage('mediaAnswer')
  async handleOnMediaAnswer(client: Socket, payload: any) {
    client.to(payload.to).emit('mediaAnswer', {
      answer: payload.answer,
      from: payload.from,
    });
  }

  @SubscribeMessage('iceCandidate')
  async handleIceCandidate(client: Socket, payload: any) {
    client.to(payload.to).emit('remotePeerIceCandidate', {
      candidate: payload.candidate,
      client: client.id,
    });
  }

  @SubscribeMessage('acceptCall')
  async handleAcceptCall(client: Socket, payload: any) {
    console.log('acceptCall');
    client.to(payload.to).emit('AcceptCall', {
      answer: payload.answer,
      from: payload.from,
    });
  }
  async GuardsConsumer(client: Socket) {
    const cookies = client.handshake.headers.cookie?.split(';');
    let access_token;
    for (let index = 0; index < cookies.length; index++) {
      const cookie = cookies[index].trim();
      if (cookie.startsWith('access_token=')) {
        access_token = cookie.substring(String('access_token=').length);
      }
    }
    const payload = await this.authService.validateToken(access_token);
    if (!payload) {
      client.disconnect();
    }
  }
}
