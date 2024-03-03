import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MsgController } from './msg/msg.controller';
import { MsgRepository } from 'src/repo/msg.repository';
import { UserRepository } from 'src/repo/user.repository';

@Module({
  imports: [
    // TypeOrmModule.forFeature([MsgRepository, UserRepository]),
  ],
  providers: [ChatService, ChatGateway, PrismaService, Repository, MsgController, MsgRepository, UserRepository],
  controllers: [ChatController],
  // exports: [MsgRepository, UserRepository]
})
export class ChatModule {}
