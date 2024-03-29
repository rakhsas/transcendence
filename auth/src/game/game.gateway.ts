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
  myId: string;
  me: number;

  rooms: { [id: string]: Room } = {};
  waitingPlayers: Player[] = [];

  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: any): Promise<void> {
    this.myId = await this.gameService.GuardsConsumer(client);
    console.log('idGame: ', this.myId);
    // if (this.waitingPlayers.find((player) => player.id === id)) return;
    this.waitingPlayers.push({ id: this.myId, socket: client });
    this.matchPlayers();
  }

  handleDisconnect(client: any): void {
    console.log('client disconnected');
    // save the state to db
    // sent win to room
    // remove from room
    this.removePlayer(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    const { uy, cy, id } = payload;
    if (!this.rooms[id]) return;

    this.rooms[id].game.computer.y = cy;
    this.rooms[id].game.user.y = uy;
  }

  private matchPlayers(): void {
    while (this.waitingPlayers.length >= 2) {
      const players = this.waitingPlayers.splice(0, 2);
      const roomId = Math.random().toString(36).substring(7);
      let index = 1;

      players.forEach((player) => {
        player.socket.join(roomId);
        this.me = index;
        this.server.to(player.socket.id).emit('roomJoined', roomId, index);
        index++;
      });
      const game = new Game(this.server, roomId);
      const room: Room = {
        players,
        game,
      };
      room.game.render();
      setTimeout(() => {
        this.rooms[roomId] = room;
      }, 2000);
    }
  }

  @Interval(10)
  handleInterval() {
    for (const id in this.rooms) {
      this.rooms[id].game.render();
      if (
        this.rooms[id].game.user.score === 5 ||
        this.rooms[id].game.computer.score === 5
      ) {
        let myScore;
        let playerScore;
        let playerId;
        if (this.me === 1) {
          myScore = this.rooms[id].game.user.score;
          playerScore = this.rooms[id].game.computer.score;
          playerId = this.rooms[id].players[1].id;
        } else {
          myScore = this.rooms[id].game.computer.score;
          playerScore = this.rooms[id].game.user.score;
          playerId = this.rooms[id].players[0].id;
        }
        this.gameService.addGame({
          userId: this.myId,
          playerId: playerId,
          userScoore: myScore,
          playerScoore: playerScore,
          winnerId: this.myId,
        });
        // save data to db
        this.rooms[id].game.render();
        delete this.rooms[id];
      }
    }
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
    if (id === undefined) return;
    console.log('room id is removed : ', id);
    this.rooms[id].game.stop();
    // Remove object with id 2
    delete this.rooms[id];

    // sent win to room
    this.server.to(id).emit('win');
  }
}
