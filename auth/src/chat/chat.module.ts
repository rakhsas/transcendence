import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Msg } from '../user/entities/msg.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Msg]),
  ],
  providers: [ChatService, ChatGateway, Repository],
  controllers: [ChatController]
})
export class ChatModule {}
