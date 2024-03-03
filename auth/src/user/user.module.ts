import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { UserGuard } from './user.guard';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserChannelRelationship } from './entities/user_channel_relation.entity';
import { Mute } from './entities/mute.entity';
import { Channel } from './entities/channel.entity';
import { Msg } from './entities/msg.entitiy';
import { Friendship } from './entities/freindship.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Msg, Channel, Mute, Friendship, UserChannelRelationship]),
    HttpModule,
  ],
  providers: [UserService, UserGuard, AuthService, Repository],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
