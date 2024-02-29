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
    // const areBlocked = await this.chatService.areUsersBlocked(payload.from, payload.to);
    // if (areBlocked)
    // {
        // users are blocked, the message should not be send.

    //   return;
    // }
    if (payload.hasOwnProperty('to'))
    {
      // userName is equale to the target user (receiver user).
      const userName = String(client.handshake.query.userName);
      const toUserSocket = this.connectedUsers.get(userName);
      if (toUserSocket)
      {
        // you can put here the logic of blocked users and send Error message
        // in the socket arguments. 

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
