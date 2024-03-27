// app.gateway.ts
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Channel } from 'src/user/entities/channel.entity';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { Msg } from 'src/user/entities/msg.entitiy';
import { Mute } from 'src/user/entities/mute.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

interface Player {
  id: string;
  socket: any;
}

interface Room {
  players: Player[];
  game: Game;
}
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
    this.speed = 4;
    this.vx = 5;
    this.vy = 5;
  }
}

class Game {
  user: User;
  computer: Computer;
  server: Server;
  ball: Ball;
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
      this.ball.speed = 5;
    }, 2000);
  }

  update() {
    // if (this.user.score === 5 || this.computer.score === 5) {
    //   this.server
    //     .to(this.roomId)
    //     .emit('message', this.user, this.computer, this.ball);
    // } else
    {
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
        this.ball.y + this.ball.r + 1 > this.height ||
        this.ball.y - this.ball.r + 1 < 0
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
    this.server
      .to(this.roomId)
      .emit('message', this.user, this.computer, this.ball);
    this.update();
  }

  stop(): void {
    console.log('stop');
  }
}
@WebSocketGateway({
  cors: true,
  path: '/sogame',
})
export class GameGetwayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  rooms: { [id: string]: Room } = {};
  waitingPlayers: Player[] = [];
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Msg)
    private readonly msgRepository: Repository<Msg>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Mute)
    private readonly muteRepository: Repository<Mute>,
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>,
    private userService: UserService,
  ) {}

  async handleConnection(client: any): Promise<void> {
    const id = await this.GuardsConsumer(client);
    console.log('idGame: ', id);
    // if (this.waitingPlayers.find((player) => player.id === id)) return;
    this.waitingPlayers.push({ socket: client, id: id });
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
        // addGame({
        //   pl1Id,
        //   pl2Id,
        //   sc1,
        //   sc2,
        // });
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

  async GuardsConsumer(client: Socket): Promise<string> {
    const cookies = client.handshake.headers.cookie?.split(';');
    let access_token;
    for (let index = 0; index < cookies.length; index++) {
      const cookie = cookies[index].trim();
      if (cookie.startsWith('access_token=')) {
        access_token = cookie.substring(String('access_token=').length);
      }
    }
    const payload = await this.authService.validateTokenId(access_token);
    if (!payload) {
      client.disconnect();
    }
    return payload.id;
  }
}
