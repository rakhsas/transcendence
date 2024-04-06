import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({ cors: true, path: '/global', methods: ['GET', 'POST'] })
export class GlobalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  userIds: string[] = [];
  playingUserIdsArray: string[] = [];
  private connectedUsers: Map<string, Socket> = new Map();
  private playingUsers: Map<string, Socket> = new Map();

  private connectedUserIds: Set<string> = new Set();
  private playinUserIds: Set<string> = new Set();
  constructor(private readonly authService: AuthService) {}
  handleConnection(client: Socket) {
    this.GuardsConsumer(client);
    const userName = String(client.handshake.query.name);
    this.connectedUsers.set(userName, client);
    this.connectedUserIds.add(userName);
    this.updateConnectedUsers();
    client.emit('updateList', { userIds: this.userIds });
    this.server.emit('updateList', { userIds: this.userIds });
  }
  
  handleDisconnect(client: Socket) {
    const userName = String(client.handshake.query.name);
    if (this.connectedUsers.has(userName)) {
      this.connectedUsers.delete(userName);
      this.connectedUserIds.delete(userName);
    }
    if (this.playingUsers.has(userName)) {
      this.playingUsers.delete(userName);
      this.playinUserIds.delete(userName);
    }
    this.updateConnectedUsers();
    this.updatePlayingUsers();
    client.emit('updateList', { userIds: this.userIds });
    this.server.emit('updateList', { userIds: this.userIds });
    client.emit('playingUsers', { userIds: this.playingUserIdsArray });
    this.server.emit('playingUsers', { userIds: this.playingUserIdsArray });
  }
  
  @SubscribeMessage('inGame')
  async handleInGame(client: Socket, payload: any) {
    //console.log('inGame');
    //console.log(payload);
    this.playingUsers.set(payload.username, client);
    this.playinUserIds.add(payload.username);
    this.updatePlayingUsers();
    client.emit('playingUsers', { userIds: this.playingUserIdsArray });
    this.server.emit('playingUsers', { userIds: this.playingUserIdsArray });
  }

  private async updateConnectedUsers() {
    this.userIds = Array.from(this.connectedUserIds);
    // this.server.emit('connectedUsers', { msg: 'hello'});
  }
  private async updatePlayingUsers() {
    this.playingUserIdsArray = Array.from(this.playinUserIds);
    //console.log(this.playingUserIdsArray);
  }

  @SubscribeMessage('acceptCall')
  async handleAcceptCall(client: Socket, payload: any) {
    //console.log('acceptCall');
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
