// app.gateway.ts
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Game } from 'src/user/entities/game.entity';
import { User } from 'src/user/entities/user.entity';


interface Player {
  socket: any;
}

interface Room {
  id: string;
  players: Player[];
}


@WebSocketGateway({
  cors: true,
  path: '/sogame'
})
export class GameGetwayService {
  @WebSocketServer()
  server: Server;

  rooms: Room[] = [];
  waitingPlayers: Player[] = [];
  private logger = new Logger('ChatGateway');

  /**
   *
   */
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private userService: UserService,
  ) {
    
  }

  /* ============================== start game functions ================================= */
  async addGame(payload: any): Promise<void> {
    
    const pl1 = await this.userService.viewUser(payload.player1Id);
    const pl2 = await this.userService.viewUser(payload.player2Id);

    const gameRecord = this.gameRepository.create({
      player1: pl1,
      player2: pl2,
      player1Score: payload.pl1Scoore,
      player2Score: payload.pl2Scoore,
    });
      await this.gameRepository.save(gameRecord);
  }
  /* ============================== end game functions ================================= */


  @SubscribeMessage("connection")
  handleConnection(client: any): void {
		this.GuardsConsumer(client);
    this.logger.log('Client connected');
    this.waitingPlayers.push({ socket: client });
    this.matchPlayers();
  }




  matchPlayers(): void {
    while (this.waitingPlayers.length >= 2) {
      const players = this.waitingPlayers.splice(0, 2);
      const room: Room = { id: Math.random().toString(36).substring(7), players };
      this.rooms.push(room);
      players.forEach((player) => {
        player.socket.join(room.id);
        this.server.to(player.socket.id).emit('roomJoined', room.id);
      });
      this.server.to(room.id).emit('start');
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    const {user, ball, id} = payload;
    client.broadcast.to(id).emit('message', user, ball)
  }



  @SubscribeMessage('disconnected')
  handleDisconnect(client: any): void {
    console.log('Client disconnected');
    this.removePlayer(client.id);
    this.matchPlayers();
  }


  private removePlayer(playerId: string): void {
    this.waitingPlayers = this.waitingPlayers.filter((p) => p.socket.id !== playerId);
    this.rooms.forEach((room) => {
      room.players = room.players.filter((p) => p.socket.id !== playerId);
    });
    this.rooms = this.rooms.filter((room) => room.players.length > 0);
  }

  async GuardsConsumer(client: Socket) {
		const cookies = client.handshake.headers.cookie?.split(';');
		let access_token;
		for (let index = 0; index < cookies.length; index++) {
			const cookie = cookies[index].trim();
			if (cookie.startsWith('access_token='))
			{
				access_token = cookie.substring(String('access_token=').length);
			}
		}
		const payload = await this.authService.validateToken(access_token);
		if (!payload)
		{
			client.disconnect();
		}
	}

}

