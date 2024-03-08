// src/chat/chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
// import { Paths } from '../../../frontend/src/utils/types';

// @WebSocketGateway()
@WebSocketGateway({cors: true, path: '/chat', methods: ['GET', 'POST']})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  usersArray = [];
  peerConnections: { [userId: string]: RTCPeerConnection } = {};
  
  private connectedUsers: Map<string, Socket> = new Map();
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userName = String(client.handshake.query.userName);
    this.connectedUsers.set(userName, client);
    this.usersArray.push(client.id);
    client.emit('update-user-list', { userIds: this.usersArray });
    this.server.emit('update-user-list', { userIds: this.usersArray });
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
    // console.log('A user disconnected');
    this.usersArray = this.usersArray.filter(id => id !== client.id);
    client.broadcast.emit('update-user-list', { userIds: this.usersArray});
    client.broadcast.emit('user-disconnected', { userId: client.id });
    const userName = String(client.handshake.query.userName);
    this.connectedUsers.delete(userName);
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

        await this.chatService.addDirectMessage(payload)
      }
      client.emit('message', payload);
    }
    // else
    //   this.server.emit('message', payload);
  }


  @SubscribeMessage('createChannel')
  async handleEventCreateChannel(socket: Socket, payload: any): Promise<void>{
    // here the payload must containe the id of the user who create the channel so it can be set as owner
    // create a new entity in the database (new channel)
    // add new entity in user channel relation the user must set as owner
    socket.join(payload.channelId);
    await this.chatService.addNewChannelEntity(payload);
    await this.chatService.addNewUserChannelEntity(payload);
  }

  @SubscribeMessage('mediaOffer')
  async handleOnMediaOffer( client: Socket,payload: any ) {
    // console.log(payload)
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

  @SubscribeMessage('callUser')
  async handleCallUser(client: Socket, payload: any)
  {
    console.log('callUser');
    client.to(payload.to).emit('RequestCall', {
      from: payload.from,
      offer: payload.offer
    });
  }

  @SubscribeMessage('acceptCall')
  async handleAcceptCall(client: Socket, payload: any)
  {
    console.log('acceptCall');
    client.to(payload.to).emit('AcceptCall', {
      answer: payload.answer,
      from: payload.from
    });
  }
  @SubscribeMessage('kickTheUser')
  async handleEvent(socket: Socket, payload: any): Promise<void> {
    // in this event handler i am excpected to get the id of the user to 
    // kick and the id of the channe from where the user will be kicked.
    socket.leave(payload.channelId);
    await this.chatService.kickUserFromChannel(payload);
  }
}


