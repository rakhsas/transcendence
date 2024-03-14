import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Any } from "typeorm";

@WebSocketGateway({ cors: true, path: '/global', methods: ['GET', 'POST'] })
export class GlobalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  userIds: string[] = [];
  private connectedUsers: Map<string, Socket> = new Map();
  constructor() { }
  handleConnection(client: Socket) {
      const userName = String(client.handshake.query.name);
      // console.log('API: username: ' + userName, 'client id: ' + client.id);
      this.connectedUsers.set(userName, client);
      this.updateConnectedUsers(); // Update connected users when a new connection is established
  }

  handleDisconnect(client: Socket) {
      const userName = String(client.handshake.query.name);
      // console.log('API: username: ' + userName, 'client id: ' + client.id , ' disconnected');
      this.connectedUsers.delete(userName);
      this.updateConnectedUsers(); // Update connected users when a disconnection occurs
  }

  private updateConnectedUsers() {
      this.userIds = Array.from(this.connectedUsers.keys());
      console.warn('API: connected users: [' + this.userIds + ']');
      this.server.emit('connectedUsers', { userIds: this.userIds });
  }

  @SubscribeMessage('acceptCall')
  async handleAcceptCall(client: Socket, payload: any) {
    console.log('acceptCall');
    client.to(payload.to).emit('AcceptCall', {
      answer: payload.answer,
      from: payload.from
    });
  }
};

