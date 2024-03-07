import { Module } from '@nestjs/common';
import { GameGetwayService } from './game-getway.service';
import { GameGetwayController } from './game-getway.controller';

@Module({
  providers: [GameGetwayService],
  controllers: [GameGetwayController]
})
export class GameGetwayModule {}
