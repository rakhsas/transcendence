// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Msg } from './../user/entities/msg.entitiy';
import { UUID, privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { User} from 'src/user/entities/user.entity';
import { Channel } from 'src/user/entities/channel.entity';
import { UserChannelRelationship, UserRole } from 'src/user/entities/user_channel_relation.entity';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Msg)
    private readonly msgRepository: Repository<Msg>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(UserChannelRelationship)
    private readonly UserChannelRelation: Repository<UserChannelRelationship>,
  ) {}

  /**
   * getDirectMessages - get the a specifique message from the database.
   * @param userId
   * @returns array of message with the user id provided
   */
  async getDirectMessages(userId: UUID): Promise<Msg[]> {
    return this.msgRepository.find({ where: { senderId: userId } });
  }

  /**
   * aerUsersBlocked - function that check if a user is blocked.
   * @param IdSender the is of the sender
   * @param idReceiver the id of the receiver message
   * @returns true if the sender or the receiver is blocked, flase otherwise.act class t
   */

  async areUsersBlocked(IdSender: UUID, idReceiver: UUID): Promise<boolean> {
    const sender = await this.userRepository.findOne({where: {providerId: IdSender}, select: { blocks: true }});
    const receiver = await this.userRepository.findOne({where: {providerId: idReceiver}, select: {blocks: true}});

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
  async addDirectMessage(senderId: UUID, receiverId: UUID, content: string): Promise<void> {
    const directMessage = this.msgRepository.create({
      message: content,
      rec_id: receiverId,
      senderId,
      isDM: true,
    });
    await this.msgRepository.save(directMessage);
  }

  /**
   * saveMessageRoom - function that add msg entitie to the database with channel ID included.
   * @param senderId the sender of the message
   * @param channelId the channel where the message will broadcasted.
   * @param content the content of the message
   */
  async saveMessageRoom(senderId: UUID, channelId: number, content: string): Promise <void> {
    const newMessageRoom = this.msgRepository.create({
      message: content,
      senderId,
      cid: channelId
    });
    await this.msgRepository.save(newMessageRoom);
  }

  /**
   * @returns all messages from database
   */
  async findAllMsg()
  {
    return await this.msgRepository.find();
  }

  async findOneMessage(id: number): Promise<Msg>
  {
    return await this.msgRepository.findOne({where: {id}});
  }

  /**
   * addNewChannelEntity - function that add a new entity to channel
   * @payload the data attribute of channel entity
   */

  async addNewChannelEntity(payload: any)
  {
    const newEntityChannel =  this.channelRepository.create({
      name: payload.channelName,
      private: payload.isPrivate,
      password: payload.password !== undefined ? payload.password : null,
      type: payload.channelType,
    });

    await this.channelRepository.save(newEntityChannel);
  }

  async addNewUserChannelEntity(payload: any)
  {
    const newEntitiyUChannel = this.UserChannelRelation.create({
      user: payload.userId,
      channel: payload.channelId,
      role: UserRole.OWNER,
      isAllowed: true
    });
    await this.UserChannelRelation.save(newEntitiyUChannel);
  }

  /**
   * kickUserFromChannel - kick a user from the channel.
   * @param payload userId and channelId from where the user will be kicked
   * in the channel-user entity.
   */
  async kickUserFromChannel(payload: any)
  {
    const targetedEntity = await this.UserChannelRelation.findOne({
      where: {user: {id: payload.userId}, channel: {id: payload.channelId}},
    });

    if (targetedEntity)
    {
      await this.UserChannelRelation.delete(targetedEntity);
    }
    else
      console.log("the user in channel-user relation is not found!!!");
  }
}


