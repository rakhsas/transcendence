import { Module } from '@nestjs/common';
import { GameGetwayService } from './game-getway.service';
import { GameGetwayController } from './game-getway.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [GameGetwayService],
  controllers: [GameGetwayController],
  imports: [ScheduleModule.forRoot()],
})
export class GameGetwayModule {}
