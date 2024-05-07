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
import { FreindsModule } from 'src/friends/friends.module';
import { FriendService } from 'src/friends/friends.service';
import { Friendship } from 'src/user/entities/freindship.entity';
import { MuteController } from 'src/mute/mute.controller';
import { MuteService } from 'src/mute/mute.service';
import { BannedController } from 'src/banned/banned.controller';
import { BannedService } from 'src/banned/banned.service';
import { Blocked } from 'src/user/entities/blocked.entity';
import { BlockedService } from 'src/blocked/blocked.service';
import { BlockedController } from 'src/blocked/blocked.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Msg, User, Channel, Mute, ChannelUser, Notif, Banned, Friendship, Blocked]),
    UserModule,
    NotificationModule,
    FreindsModule,
    HttpModule
    // ChannelModule
  ],
  providers: [ChatService, ChatGateway, Repository, MsgController, AuthService, ChannelService, NotificationService, BannedService, FriendService, MuteService, BlockedService],
  // providers: [ChatService, ChatGateway, Repository, MsgController, MsgRepository, UserRepository],
  controllers: [ChatController, MuteController, BannedController, BlockedController],
  // exports: [MsgRepository, UserRepository]
})
export class ChatModule {}
