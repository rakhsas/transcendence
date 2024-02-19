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
    // throw new Error('Method not implemented.');
    this.connectedUsers.set(client.id, client);
  }
  handleDisconnect(client: Socket) {
    // throw new Error('Method not implemented.');
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    if (payload.to)
    {
      const toUserSocket = this.connectedUsers.get(payload.to);
      if (toUserSocket)
      {
        toUserSocket.emit('message', payload);
        await this.chatService.addDirectMessage(payload.from, payload.to, payload.content)
      }
    }
    else
      this.server.emit('message', payload);
  }
}
