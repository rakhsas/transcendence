import { Module } from '@nestjs/common';
import { GameGetwayService } from './game-getway.service';
import { GameGetwayController } from './game-getway.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Msg } from 'src/user/entities/msg.entitiy';
import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/user/entities/channel.entity';
import { Mute } from 'src/user/entities/mute.entity';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Msg, User, Channel, Mute, ChannelUser]),
    HttpModule
  ],
  controllers: [GameGetwayController],
  providers: [GameGetwayService, AuthService, Repository, UserService],
})
export class GameGetwayModule {}
