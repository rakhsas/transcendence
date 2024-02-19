// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDirectMessages(userId: number): Promise<any[]> {
    return this.prismaService.getDirectMessages(userId);
  }

  async addDirectMessage(userId: number, channelId: number, content: string): Promise<void> {
    await this.prismaService.createDirectMessage(userId, channelId, content);
  }
}
