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
import { UserModule } from 'src/user/user.module';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelService } from 'src/channel/channel.service';
import { NotificationModule } from 'src/notification/notification.module';
import { Notif } from 'src/user/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Banned } from 'src/user/entities/ban.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Msg, User, Channel, Mute, ChannelUser, Notif, Banned]),
    UserModule,
    NotificationModule
    // ChannelModule
  ],
  providers: [ChatService, ChatGateway, Repository, MsgController, AuthService, ChannelService, NotificationService],
  // providers: [ChatService, ChatGateway, Repository, MsgController, MsgRepository, UserRepository],
  controllers: [ChatController],
  // exports: [MsgRepository, UserRepository]
})
export class ChatModule {}
