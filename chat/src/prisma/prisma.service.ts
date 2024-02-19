import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

// part of life cycle hook, they get called when the module is init 
// then we connect to the database.
  async onModuleInit() {
    await this.$connect();
  }

  // the same as onModuleInit but we disconnected from the database 
  // zoro was here.
  async onModuleDestroy() {
    await this.$disconnect();
  }


  readonly prisma = new PrismaClient();

  async createDirectMessage(userId: number, channelId: number, content: string): Promise<any> {
    return this.prisma.msg.create({
      data: {
        msg: content,
        userId,
        cid: channelId,
      },
    });
  }

  async getDirectMessages(userId: number): Promise<any[]> {
    return this.prisma.msg.findMany({
      where: {
        userId,
      },
    });
  }
}