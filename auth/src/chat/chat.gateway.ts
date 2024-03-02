// src/chat/chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

// @WebSocketGateway()
@WebSocketGateway({cors: true, path: '/chat'})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  usersArray = [];
  peerConnections: { [userId: string]: RTCPeerConnection } = {};
  
  private connectedUsers: Map<string, Socket> = new Map();
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    // const userName = String(client.handshake.query.userName);
    // // throw new Error('Method not implemented.');
    // this.connectedUsers.set(userName, client);
    // console.log("socket id: " + client.id);
    // console.log("client: " + client);
    // console.log("map: " + this.connectedUsers.size);
    // added lines
    // console.log('A user connected');
    // console.log('client id: ' + client.id);
    this.usersArray.push(client.id);
    console.log(this.usersArray.length);
    client.broadcast.emit('update-user-list', { userIds: this.usersArray });
  }
  handleDisconnect(client: Socket) {
    // throw new Error('Method not implemented.');
    // const userName = String(client.handshake.query.userName);
    // this.connectedUsers.delete(userName);
    // console.log('A user disconnected');
    // console.log('client id: ' + client.id);
    if (this.peerConnections[client.id]) {
      this.peerConnections[client.id].close();
      delete this.peerConnections[client.id];
    }
    console.log('A user disconnected');
    this.usersArray = this.usersArray.filter(id => id !== client.id);
    client.broadcast.emit('update-user-list', { userIds: this.usersArray});
    client.broadcast.emit('user-disconnected', { userId: client.id });
  }
  
  

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    const areBlocked = await this.chatService.areUsersBlocked(payload.from, payload.to);
    if (areBlocked)
    {
      // users are blocked, the message should not be send.
      
      return;
    }
    if (payload.to)
    {
      // userName is equale to the target user (receiver user).
      const userName = String(client.handshake.query.userName);
      const toUserSocket = this.connectedUsers.get(userName);
      if (toUserSocket)
      {
        // you can put here the logic of blocked users and send Error message
        // in the socker arguments. 
        
        // The code goes here ...
        
        toUserSocket.emit('message', {
          "to": payload.to,
          "from": payload.from,
          "content": payload.content,
          "isOwner": false
        });
        await this.chatService.addDirectMessage(payload.from, payload.to, payload.content)
      }
      client.emit('message', payload);
    }
    else
    this.server.emit('message', payload);
  }
  @SubscribeMessage('mediaOffer')
  async handleOnMediaOffer( client: Socket,payload: any ) {
    console.log(payload)
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
  async handleIceCandidate(client: Socket, payload: any)
  {
    client.to(payload.to).emit('remotePeerIceCandidate', {
      candidate: payload.candidate,
      client: client.id
    });
  }

}
