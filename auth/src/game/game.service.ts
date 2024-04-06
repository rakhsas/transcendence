// app.gateway.ts
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GameEntity } from 'src/user/entities/game.entity';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GameService {
  logedUser: string;

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const gameResult2 = new GameEntity();

    const pl1 = await this.userService.viewUser(payload.userId);
    const pl2 = await this.userService.viewUser(payload.playerId);
    const winner = await this.userService.viewUser(payload.winnerId);
    //console.log("inside add game service.........",payload.userScoore, payload.playerScoore);
    // //console.log(
      //   '-------------------------------------------------------i------------=-==============>>  player: ',
      //   pl1.username,
      //   payload.pl1Scoore,
      // );
      // if (payload.userScoore > payload.playerScoore)
      if (payload.userId === payload.winnerId)
      {
        const oldScore = pl1.score;
        const newScore = oldScore + 10;

        pl1["score"] = newScore;
        await this.userRepository.save(pl1);
      }
      else
      {
        const oldScore = pl2.score;
        const newScore = oldScore + 10;

        pl2["score"] = newScore;
        await this.userRepository.save(pl2);
      }
    gameResult.player1 = pl1;
    gameResult.player2 = pl2;
    gameResult.user_score = payload.userScoore;
    gameResult.player_score = payload.playerScoore;
    gameResult.winner = winner;

    gameResult2.player1 = pl2;
    gameResult2.player2 = pl1;
    gameResult2.user_score = payload.playerScoore;
    gameResult2.player_score = payload.userScoore;
    gameResult2.winner = winner;

    await this.gameRepository.save(gameResult);
    await this.gameRepository.save(gameResult2);
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
