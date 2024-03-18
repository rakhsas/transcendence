// app.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

interface Player {
  socket: any;
}

interface Room {
  id: string;
  players: Player[];
}

@WebSocketGateway({
  cors: true,
  path: '/sogame',
})
export class GameGetwayService {
  @WebSocketServer()
  server: Server;

  rooms: Room[] = [];
  waitingPlayers: Player[] = [];
  private logger = new Logger('ChatGateway');

  @SubscribeMessage('connection')
  handleConnection(client: any): void {
    this.logger.log('Client connected');
    this.waitingPlayers.push({ socket: client });
    this.matchPlayers();
  }

  matchPlayers(): void {
    while (this.waitingPlayers.length >= 2) {
      const players = this.waitingPlayers.splice(0, 2);
      const room: Room = {
        id: Math.random().toString(36).substring(7),
        players,
      };
      this.rooms.push(room);
      let index = -1;
      players.forEach((player) => {
        player.socket.join(room.id);
        this.server.to(player.socket.id).emit('roomJoined', room.id, index);
        index += 2;
      });
      this.server.to(room.id).emit('start');
    }
  }

  @SubscribeMessage('lose')
  handleLose(client: any, payload: any): void {
    this.server.to(client.id).emit('lose');
    // this.server.to(client.id).emit('lose');
    const { id } = payload;
    console.log('lose', id);
    client.broadcast.to(id).emit('win');
  }
  @SubscribeMessage('ball')
  handleBall(client: any, payload: any): void {
    const { ball, id } = payload;
    client.broadcast.to(id).emit('ball', ball);
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    const { user, id } = payload;
    client.broadcast.to(id).emit('message', user);
  }

  @SubscribeMessage('disconnected')
  handleDisconnect(client: any): void {
    this.logger.log('Client disconnected');
    this.removePlayer(client.id);
  }

  private getRoom(playerId: string): Room | undefined {
    for (const room of this.rooms) {
      const player = room.players.find((p) => p.socket.id === playerId);
      if (player) {
        return room;
      }
    }
    return undefined;
  }

  private removePlayer(playerId: string): void {
    const indexOfPlayerToRemove = this.waitingPlayers.findIndex(
      (obj) => obj.socket.id === playerId,
    );
    // Get index of object with id 2 and remove it
    if (indexOfPlayerToRemove !== -1) {
      this.waitingPlayers.splice(indexOfPlayerToRemove, 1);
    }

    const room: Room = this.getRoom(playerId);
    if (room === undefined) return;
    this.server.to(room.id).emit('win');
    // Remove object with id 2
    const indexToRemove = this.rooms.findIndex((obj) => obj.id === room.id);
    if (indexToRemove !== -1) {
      this.rooms.splice(indexToRemove, 1);
    }
  }
}
