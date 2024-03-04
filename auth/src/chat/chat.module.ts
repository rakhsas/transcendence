import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Msg } from '../user/entities/msg.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MsgController } from './msg/msg.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Msg, User]),
  ],
  providers: [ChatService, ChatGateway, Repository, MsgController],
  // providers: [ChatService, ChatGateway, Repository, MsgController, MsgRepository, UserRepository],
  controllers: [ChatController],
  // exports: [MsgRepository, UserRepository]
})
export class ChatModule {}
