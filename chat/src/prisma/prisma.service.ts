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

  async areUsersBlocked(IdSender: number, IdReceiver: number): Promise<boolean>
  {
    const sender = await this.user1.findUnique({where: {id: IdSender}, select: { blocks: true }});
    const receiver = await this.user1.findUnique({where: { id: IdReceiver}, select: { blocks: true}})
    
    const isReceiverBlocked = sender?.blocks.includes(IdReceiver) ?? false;
    const isSenderBlocker = receiver?.blocks.includes(IdSender) ?? false;

    return isReceiverBlocked || isSenderBlocker;
  }

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