// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Msg } from './../user/entities/msg.entitiy';
import { User } from 'src/user/model/user.model';


@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Msg)
    private readonly msgRepository: Repository<Msg>,
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * getDirectMessages - get the a specifique message from the database.
   * @param userId
   * @returns array of message with the user id provided
   */
  async getDirectMessages(userId: number): Promise<Msg[]> {
    return this.msgRepository.find({ where: { senderId: userId } });
  }

  /**
   * aerUsersBlocked - function that check if a user is blocked.
   * @param IdSender the is of the sender
   * @param idReceiver the id of the receiver message
   * @returns true if the sender or the receiver is blocked, flase otherwise.act class t
   */

  async areUsersBlocked(IdSender: number, idReceiver: number): Promise<boolean> {
    const sender = await this.userRepository.findOne({where: {id: IdSender}, select: { blocks: true }});
    const receiver = await this.userRepository.findOne({where: {id: idReceiver}, select: {blocks: true}});

    const isReceiverBlocked = sender?.blocks.includes(idReceiver) ?? false;
    const isSenderBlocker = receiver?.blocks.includes(IdSender) ?? false;

    return isReceiverBlocked || isSenderBlocker;
  }

  /**
   * addDirectMessage - add the messge to database.
   * @param senderId the sender
   * @param receiverId the receiver
   * @param content the content of the message
   */
  async addDirectMessage(senderId: number, receiverId: number, content: string): Promise<void> {
    const directMessage = this.msgRepository.create({
      msg: content,
      rec_id: receiverId,
      senderId
    });
    await this.msgRepository.save(directMessage);
  }
}
