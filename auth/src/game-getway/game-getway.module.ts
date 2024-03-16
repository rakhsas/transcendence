import { Module } from '@nestjs/common';
import { GameGetwayService } from './game-getway.service';
import { GameGetwayController } from './game-getway.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [GameGetwayService, AuthService],
  controllers: [GameGetwayController]
})
export class GameGetwayModule {}
