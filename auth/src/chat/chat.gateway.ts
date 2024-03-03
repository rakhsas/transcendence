// src/chat/chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
// import { Paths } from '../../../frontend/src/utils/types';

// @WebSocketGateway()
@WebSocketGateway({cors: true, path: '/chat'})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // @WebSocketServer() server: Server;
  usersArray = [];
  peerConnections: { [userId: string]: RTCPeerConnection } = {};
  
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
          "isOwner": false
        });

        await this.chatService.addDirectMessage(payload.from, payload.to, payload.content)
      }
      client.emit('message', payload);
    }
    // else
    //   this.server.emit('message', payload);
  }


  @SubscribeMessage('createChannel')
  async handleEventCreateChannel(client: Socket, payload: any): Promise<void>{
    // here the payload must containe the id of the user who create the channel so it can be set as owner
    // create a new entity in the database (new channel)
    // add new entity in user channel relation the user must set as owner
    
  }

  @SubscribeMessage('mediaOffer')
  async handleOnMediaOffer( client: Socket, payload: any ) {
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


