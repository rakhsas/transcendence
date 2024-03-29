import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/user/entities/game.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { GameGateway } from './game.gateway';
@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, User]),
    UserModule,
    ScheduleModule.forRoot(),
  ],
  // imports: [ScheduleModule.forRoot()],
  controllers: [GameController],
  providers: [GameService, AuthService, GameGateway],
})
export class GameGetwayModule {}
