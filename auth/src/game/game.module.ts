import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Msg } from 'src/user/entities/msg.entitiy';
import { User } from 'src/user/entities/user.entity';
import { GameGateway } from './game.gateway';
import { Channel } from 'src/user/entities/channel.entity';
import { Mute } from 'src/user/entities/mute.entity';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { HttpModule } from '@nestjs/axios';
import { GameEntity } from 'src/user/entities/game.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Msg,
      User,
      Channel,
      Mute,
      ChannelUser,
      GameEntity,
    ]),
    HttpModule,
  ],
  controllers: [GameController],
  providers: [GameService, AuthService, GameGateway, Repository, UserService],
})
export class GameGetwayModule {}
