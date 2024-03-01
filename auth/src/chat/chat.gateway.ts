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
    const recieverName = String(client.handshake.query.recieverName);
    this.connectedUsers.set(recieverName, client);
    console.log("socket id: " + client.id);
    console.log("client: " + client);
    console.log("map: " + this.connectedUsers.size);
    // Handle initial connection (e.g., send list of available rooms)
  }
  
  handleDisconnect(client: Socket) {
    const recieverName = String(client.handshake.query.recieverName);
    this.connectedUsers.delete(recieverName);
    // Handle disconnection (e.g., remove user from room)
  }



  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any): Promise<void> {
   // you can put the blocked code here {if they are blocked they can't send messages}.
    if (payload.hasOwnProperty('to'))
    {
      const recieverName = String(client.handshake.query.recieverName);
      const toUserSocket = this.connectedUsers.get(recieverName);
      if (toUserSocket)
      {
        // you can put here the logic of blocked users and send Error message in the socket arguments. 
        // The code goes here ...

        toUserSocket.emit('message', {
          "to": payload.to,
          "from": payload.from,
          "content": payload.content,
          // "isOwner": false
        });

        await this.chatService.addDirectMessage(payload.from, payload.to, payload.content)
      }
      client.emit('message', payload);
    }
    else
      this.server.emit('message', payload);
  }
}


/*

*/