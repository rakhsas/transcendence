// app.gateway.ts
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GameEntity } from 'src/user/entities/game.entity';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  logedUser: string;

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private userService: UserService,
  ) {}

  /* ============================== start game functions ================================= */
  async addGame(payload: any): Promise<void> {
    // userId: ,
    // playerId:,
    // userScoore:,
    // playerScoore:,
    // winnerId:,
    const gameResult = new GameEntity();
    const pl1 = await this.userService.viewUser(payload.userId);
    const pl2 = await this.userService.viewUser(payload.playerId);
    const winner = await this.userService.viewUser(payload.winnerId);
    console.log(
      '-------------------------------------------------------------------=-==============>>  player: ',
      pl1.username,
      payload.pl1Scoore,
    );
    gameResult.player1 = pl1;
    gameResult.player2 = pl2;
    gameResult.userScoore = payload.userScoore;
    gameResult.playerScoore = payload.playerScoore;
    gameResult.winner = winner;

    // console.log("players: ", pl1, pl2);
    await this.gameRepository.save(gameResult);
  }
  /* ============================== end game functions ================================= */

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
