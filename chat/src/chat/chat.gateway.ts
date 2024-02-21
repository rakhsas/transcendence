// src/chat/chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  private connectedUsers: Map<string, Socket> = new Map();
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userName = String(client.handshake.query.userName);
    // throw new Error('Method not implemented.');
    this.connectedUsers.set(userName, client);
    console.log("socket id: " + client.id);
    console.log("client: " + client);
    console.log("map: " + this.connectedUsers.size);
  }
  handleDisconnect(client: Socket) {
    // throw new Error('Method not implemented.');
    const userName = String(client.handshake.query.userName);
    this.connectedUsers.delete(userName);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    console.log("event message catched!");
    if (payload.to)
    {
      const userName = String(client.handshake.query.userName);
      const toUserSocket = this.connectedUsers.get(userName);
      console.log("username: " + userName);
      if (toUserSocket)
      {
        //console.log(payload);
        toUserSocket.emit('message', payload);
        console.log("-to : " + payload.to);
        console.log("-from : " + payload.from);
        console.log("-content : " + payload.content);
        await this.chatService.addDirectMessage(payload.from, payload.to, payload.content)
      }
    }
    else
      this.server.emit('message', payload);
  }
}
