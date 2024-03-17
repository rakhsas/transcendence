// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Msg } from './../user/entities/msg.entitiy';
import { UUID, privateDecrypt } from 'crypto';
import { Repository, UnorderedBulkOperation } from 'typeorm';
import { User} from 'src/user/entities/user.entity';
import { Channel } from 'src/user/entities/channel.entity';
import { channel } from 'diagnostics_channel';
import { Mute } from 'src/user/entities/mute.entity';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { UserRole } from '../user/entities/channel_member.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Msg)
    private readonly msgRepository: Repository<Msg>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Mute)
    private readonly muteRepository: Repository<Mute>,
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>
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


  // ================================= Users functions ================================================================================

  async areUsersBlocked(IdSender: UUID, idReceiver: UUID): Promise<boolean> {
    const sender = await this.userRepository.findOne({where: {id: IdSender}, select: { blocks: true }});
    const receiver = await this.userRepository.findOne({where: {id: idReceiver}, select: {blocks: true}});

    const isReceiverBlocked = sender?.blocks.includes(idReceiver) ?? false;
    const isSenderBlocker = receiver?.blocks.includes(IdSender) ?? false;

    return isReceiverBlocked || isSenderBlocker;
  }


  async BlockUser(userId: UUID, idOfBlockedUser: UUID): Promise <User>
  {
    const user = await this.userRepository.findOne({where: {id: userId}});
    
    if (!user)
      throw new Error("User Not Found!");
    if (!user.blocks.includes(idOfBlockedUser))
    {
      user.blocks = [...user.blocks, idOfBlockedUser];
      return this.userRepository.save(user);
    }
    else
    {
      throw new Error("User already blocked!! :)");
    }
  }

  // ====================================== Messages function ==========================================================================

  /**
   * addDirectMessage - add the messge to database.
   * @param senderId the sender
   * @param receiverId the receiver
   * @param content the content of the message
   */
  async addDirectMessage(payload: any): Promise<void> {
    // console.log('payload.recieverId: ',payload.recieverId, 'payload.senderId: ', payload.senderId)
    const directMessage = this.msgRepository.create({
      message: payload.message,
      recieverId: payload.recieverId,
      senderId: payload.senderId,
      cid: (payload.cid !== undefined) ? payload.cid : null,
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


  // ============================= Channel function =================================================================

  /**
   * addNewChannelEntity - function that add a new entity to channel
   * @payload the data attribute of channel entity
   */

  async addNewChannelEntity(payload: any)
  {
    const ownerPromise: Promise<User> = this.userRepository.findOne(payload.ownerId);
    const newEntityChannel =  this.channelRepository.create({
      name: payload.channelName,
      private: payload.isPrivate,
      password: "password" in payload ? payload.password : null,
      // password: payload.password !== undefined ? payload.password : null,
      type: payload.channelType,
      owner: ownerPromise,
    });

    await this.channelRepository.save(newEntityChannel);
  }

  async addNewMemberToChannel(payload: any) {
    // Load user and channel entities
    const user = await this.userRepository.findOne(payload.userId);
    const channel = await this.channelRepository.findOne(payload.channelId);

    if (!user || !channel) {
      throw new Error('User or channel not found'); // Handle the case where user or channel is not found
    }

    // Create a new ChannelUser instance
    const newEntity = this.channelUserRepository.create({
      user,
      channel,
      role: payload.role,
    });

    // Save the new ChannelUser record
    await this.channelUserRepository.save(newEntity);
  }

  /**
   * kickUserFromChannel - kick a user from the channel.
   * @param payload userId and channelId from where the user will be kicked
   * in the channel-user entity.
   */
  async kickUserFromChannel(payload: any)
  {
    const targetedEntity = await this.channelUserRepository.findOne({
      where: {user: {id: payload.userId}, channel: {id: payload.channelId}},
    });

    if (targetedEntity)
    {
      await this.channelUserRepository.delete(targetedEntity);
    }
    else
      console.log("the user in channel-user relation is not found!!!");
  }

  // =============================== Mute functions ================================================
  async muteUser(payload: any)
  {
    const newEntity = this.muteRepository.create({
      finishAt: payload.endOfMute,
      userId: payload.userId,
      cid: payload.channelId
    })
    
    await this.muteRepository.save(newEntity);
  }
}


