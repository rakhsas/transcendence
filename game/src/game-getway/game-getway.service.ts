// app.gateway.ts
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGetwayService {
  @WebSocketServer() server: Server = new Server();
  private logger = new Logger('ChatGateway');
  i: number = 0;

  @SubscribeMessage('ready')
  handleReady(client: Socket, payload: any){
    this.i++;
    if (this.i % 2 == 0)
      this.server.emit('start');

  }
  @SubscribeMessage('stop')
  handleStop(){
    this.i--;
  }
  @SubscribeMessage('push')
  handleMessage(client: Socket, payload: any) {
    // Emit the received message to the specified recipient
    //
    const { user,ball, id } = payload;
    this.server.emit('catch', user,ball, id);
//     this.sendMessageToSocket(recipient, 'catch', message);
  }

  // Method to send a message to a specific socket
  private sendMessageToSocket(socketId: string, event: string, message: any) {
    this.server.to(socketId).emit(event, message);
  }
}

