// app.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

class User {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;

  constructor(width, height) {
    this.y = height / 2 - 50;
    this.x = width * 0;
    this.width = 15;
    this.height = 100 - 15;
    this.color = '#FD0363';
    this.score = 0;
  }
}

class Computer {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;

  constructor(width, height) {
    this.x = width - 15;
    this.y = height / 2 - 50;
    this.width = 15;
    this.height = 100 - 15;
    this.color = '#FD0363';
    this.score = 0;
  }
}

class Ball {
  x: number;
  y: number;
  r: number;
  color: string;
  speed: number;
  vx: number;
  vy: number;

  constructor(width, height) {
    this.x = width / 2;
    this.y = height / 2;
    this.r = 10;
    this.color = '#FDA403';
    this.speed = 7;
    this.vx = 5;
    this.vy = 5;
  }
}

class Game {
  user: User;
  computer: Computer;
  server: Server;
  ball: Ball;
  intervalId: NodeJS.Timeout | any;
  roomId: string;
  width: number;
  height: number;

  constructor(server: Server, roomId: string) {
    this.width = 600;
    this.height = 400;
    this.server = server;
    this.roomId = roomId;
    this.user = new User(this.width, this.height);
    this.computer = new Computer(this.width, this.height);
    this.ball = new Ball(this.width, this.height);
    this.server.on('message', (comp) => {
      this.computer.y = comp.y;
    });
  }

  // collision detection
  collision(b: any, p: any) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;

    return (
      p.left < b.right &&
      p.top < b.bottom &&
      p.right > b.left &&
      p.bottom > b.top
    );
  }

  resetBall() {
    // i want to sleep for 1 second
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    const oldx = -this.ball.vx;
    const oldy = this.ball.vy;
    this.ball.vy = 0;
    this.ball.vx = 0;

    setTimeout((vx = oldx, vy = oldy) => {
      this.ball.vx = vx;
      this.ball.vy = vy;
      this.ball.speed = 7;
    }, 2000);
  }

  update() {
    if (this.user.score === 5 || this.computer.score === 5) {
      const state = this.user.score === 5 ? 'win' : 'lose';
      console.log('state is:', state);
    } else {
      if (this.ball.x - this.ball.r < 0) {
        this.computer.score++;
        this.resetBall();
      } else if (this.ball.x + this.ball.r > this.width) {
        this.user.score++;
        this.resetBall();
      }

      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;
      if (
        this.ball.y + this.ball.r > this.height ||
        this.ball.y - this.ball.r < 0
      )
        this.ball.vy = -this.ball.vy;

      const player: User | Computer =
        this.ball.x + this.ball.r < this.width / 2 ? this.user : this.computer;

      if (this.collision(this.ball, player)) {
        let collidePoint: number = this.ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        const angle = (Math.PI / 4) * collidePoint;

        const direction: 1 | -1 = this.ball.x < this.width / 2 ? 1 : -1;
        this.ball.vx = direction * this.ball.speed * Math.cos(angle);
        this.ball.vy = this.ball.speed * Math.sin(angle);
        this.ball.speed += 0.1;
      }
    }
  }
  render() {
    const game = () => {
      this.update();
      this.server
        .to(this.roomId)
        .emit('message', this.user, this.computer, this.ball);
    };
    this.intervalId = setInterval(game, 1000 / 60);
  }
}

interface Player {
  socket: any;
}

interface Room {
  id: string;
  players: Player[];
  game: Game;
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
      const roomId = Math.random().toString(36).substring(7);
      const room: Room = {
        id: roomId,
        players,
        game: new Game(this.server, roomId),
      };
      this.rooms.push(room);
      let index = 1;
      players.forEach((player) => {
        player.socket.join(room.id);
        this.server.to(player.socket.id).emit('roomJoined', room.id, index);
        index++;
      });
      room.game.render();
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    const { uy, cy, id } = payload;
    const room = this.getRoom(client.id);
    room.game.computer.y = cy;
    room.game.user.y = uy;
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
