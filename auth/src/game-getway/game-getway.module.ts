import { Module } from '@nestjs/common';
import { GameGetwayService } from './game-getway.service';
import { GameGetwayController } from './game-getway.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [GameGetwayController],
  providers: [GameGetwayService, AuthService],
})
export class GameGetwayModule {}
