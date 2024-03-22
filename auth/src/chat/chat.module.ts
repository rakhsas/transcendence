import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Msg } from '../user/entities/msg.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MsgController } from '../msg/msg.controller';
import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/user/entities/channel.entity';
import { Mute } from 'src/user/entities/mute.entity';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Msg, User, Channel, Mute, ChannelUser]),
  ],
  providers: [ChatService, ChatGateway, Repository, MsgController, AuthService],
  // providers: [ChatService, ChatGateway, Repository, MsgController, MsgRepository, UserRepository],
  controllers: [ChatController],
  // exports: [MsgRepository, UserRepository]
})
export class ChatModule {}
