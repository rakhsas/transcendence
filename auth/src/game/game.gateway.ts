import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Interval } from '@nestjs/schedule';
import { GameService } from './game.service';
import { Game } from './game';

interface Player {
  id: string;
  socket: any;
}

interface Room {
  players: Player[];
  game: Game;
}

@WebSocketGateway({ cors: true, path: '/sogame' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  rooms: { [id: string]: Room } = {};
  waitingPlayers: Player[] = [];
  waitingFriend: Player[] = [];

  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: any): Promise<void> {
    console.log('client connected');
  }

  @SubscribeMessage('playRandomMatch')
  async handleRandomMatch(client: any) {
    const id = await this.gameService.GuardsConsumer(client);
    console.log('idGame: ', id);
    if (this.waitingPlayers.find((player) => player.id === id)) {
      this.server.to(client.id).emit('inGame');
      return;
    }
    if (this.waitingFriend.find((player) => player.id === id)) {
      this.server.to(client.id).emit('inGame');
      return;
    }
    for (const id in this.rooms) {
      const player = this.rooms[id].players.find((p) => p.id === id);
      if (player) {
        this.server.to(client.id).emit('inGame');
        return;
      }
    }
    this.waitingPlayers.push({ id: id, socket: client });
    this.matchPlayers();
  }

  @SubscribeMessage('playWithFriend')
  handlePlayWithFriend(client: any, payload: { id: string }) {
    const { id } = payload;
    const friend = this.waitingFriend.find((player) => player.id === id);
    if (!friend) {
      client.emit('friendNotFound');
      this.waitingFriend.push({ id: client.id, socket: client });
      return;
    }
    const roomId = Math.random().toString(36).substring(7);
    client.join(roomId);
    friend.socket.join(roomId);
    client.emit('roomJoined', roomId, 1, friend.id);
    friend.socket.emit('roomJoined', roomId, 2, client.id);
    const game = new Game(this.server, roomId);
    const room: Room = {
      players: [
        { id: client.id, socket: client },
        { id: friend.id, socket: friend.socket },
      ],
      game,
    };
    this.rooms[roomId] = room;
  }

  handleDisconnect(client: any): void {
    console.log('client disconnected');
    // save the state to db
    // sent win to room
    // remove from room
    this.removePlayer(client.id);
  }

  @SubscribeMessage('userData')
  handleUserData(client: any, payload: { id: string; userData: any }) {
    const { id, userData } = payload;
    client.broadcast.to(id).emit('userData', userData);
  }

  @SubscribeMessage('moves')
  handleMoves(
    client: any,
    payload: { id: string; y: number; index: number },
  ): void {
    const { id, y, index } = payload;
    if (!this.rooms[id]) return;
    client.broadcast.to(id).emit('move', y);
    if (index === 1) this.rooms[id].game.user.y = y;
    else this.rooms[id].game.computer.y = y;
  }

  private matchPlayers(): void {
    while (this.waitingPlayers.length >= 2) {
      const players = this.waitingPlayers.splice(0, 2);
      const roomId = Math.random().toString(36).substring(7);
      let index = 1;

      players.forEach((player) => {
        player.socket.join(roomId);
        this.server
          .to(player.socket.id)
          .emit('roomJoined', roomId, index, players[index % 2].id);
        index++;
      });
      const game = new Game(this.server, roomId);
      const room: Room = {
        players,
        game,
      };
      this.rooms[roomId] = room;
    }
  }

  @Interval(10)
  handleInterval() {
    for (const id in this.rooms) {
      if (
        this.rooms[id].game.user.score === 5 ||
        this.rooms[id].game.computer.score === 5
      ) {
        this.server.to(id).emit('gameOver', {
          index: this.rooms[id].game.user.score === 5 ? 1 : 2,
        });
        this.saveMatch(this.rooms[id], null);
        delete this.rooms[id];
      }
      this.rooms[id].game.render();
    }
  }

  private async saveMatch(room: Room, winer: string | null) {
    const userId = room.players[0].id;
    const compId = room.players[1].id;

    const userScore = winer
      ? room.players[0].socket.id === winer
        ? 0
        : 5
      : room.game.user.score;
    const compScore = winer
      ? room.players[1].socket.id === winer
        ? 0
        : 5
      : room.game.computer.score;

    const winerId = userScore === 5 ? userId : compId;

    this.gameService.addGame({
      userId: userId,
      playerId: compId,
      userScoore: userScore,
      playerScoore: compScore,
      winnerId: winerId,
    });
  }

  private getIdOfRoom(playerId: string): string | undefined {
    for (const id in this.rooms) {
      const player = this.rooms[id].players.find(
        (p) => p.socket.id === playerId,
      );
      if (player) {
        return id;
      }
    }
    return undefined;
  }

  private removePlayer(playerId: string): void {
    // remove player from waiting palyers if it existes
    const indexOfPlayerToRemove = this.waitingPlayers.findIndex(
      (obj) => obj.socket.id === playerId,
    );
    // Get index of object with id 2 and remove it
    if (indexOfPlayerToRemove !== -1) {
      this.waitingPlayers.splice(indexOfPlayerToRemove, 1);
      return;
    }

    // romove it from the room

    const id: string = this.getIdOfRoom(playerId);
    console.log('room id is : ', id);
    if (id === undefined) return;
    this.saveMatch(this.rooms[id], playerId);
    console.log('room id is removed : ', id);
    this.rooms[id].game.stop();
    // Remove object with id 2
    delete this.rooms[id];

    // sent win to room
    this.server.to(id).emit('win');
  }
}
