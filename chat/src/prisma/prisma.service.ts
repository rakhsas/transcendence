import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // console.log("----+> " + process.env.DATABASE_URL);
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/db1',
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

  //readonly prisma = new PrismaClient();

  async createDirectMessage(senderId: number, receiverId: number, content: string): Promise<any> {
    console.log("the message is cradted.!")
    return this.msg.create({
      data: {
        msg: content,
        cid: 0, 
        rec_id: receiverId,
        senderId,
      },
    });
  }

  async getDirectMessages(senderId: number): Promise<any[]> {
    return this.msg.findMany({
      where: {
        senderId,
      },
    });
  }
  



}