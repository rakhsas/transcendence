// src/chat/chat.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Msg } from './../user/entities/msg.entitiy';
import { UUID, privateDecrypt } from 'crypto';
import { Repository, UnorderedBulkOperation } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Channel, ChannelTypes } from 'src/user/entities/channel.entity';
import { channel } from 'diagnostics_channel';
import { Mute } from 'src/user/entities/mute.entity';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { UserRole } from '../user/entities/channel_member.entity';
import { UserService } from 'src/user/user.service';
import { ChannelService } from 'src/channel/channel.service';
import { Banned } from 'src/user/entities/ban.entity';
import { Blocked } from 'src/user/entities/blocked.entity';

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
    private readonly channelUserRepository: Repository<ChannelUser>,
    @InjectRepository(Banned)
    private readonly BanRepository: Repository<Banned>,
    private userService: UserService,
    @InjectRepository(Blocked)
    private readonly blockRepository: Repository<Blocked>,
    private channelService: ChannelService,
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

  async blockUser(payload: any): Promise<Blocked>
  {
      // the userId and the id the user you want to block
      const user = await this.userService.viewUser(payload.userId);
      const BlockedUser = await this.userService.viewUser(payload.blockedUserId);
      const blocked = new Blocked();
      const reverseBlocked = new Blocked();

      blocked.user = Promise.resolve(user);
      blocked.blockedUser = Promise.resolve(BlockedUser);

      reverseBlocked.user = Promise.resolve(BlockedUser);
      reverseBlocked.blockedUser = Promise.resolve(user);

      return this.blockRepository.save(blocked);
  }

  async banUser(payload: any){
    const newRecord = this.BanRepository.create({
      user: {id: payload.userId},
      channel: {id: payload.channelId}
    });
    this.BanRepository.save(newRecord);
 }

 async isBanned(payload: any) {
  const newRecord = this.BanRepository.find({
      // where: {id: payload.userId},
      /*
        where: {user: {id: payload.userId},
                
        }
      */
      
  });
  // this.BanRepository.save(newRecord);
}
  // async areUsersBlocked(IdSender: UUID, idReceiver: UUID): Promise<boolean> {
  //   const sender = await this.userRepository.findOne({ where: { id: IdSender }, select: { blocks: true } });
  //   const receiver = await this.userRepository.findOne({ where: { id: idReceiver }, select: { blocks: true } });

  //   const isReceiverBlocked = sender?.blocks.includes(idReceiver) ?? false;
  //   const isSenderBlocker = receiver?.blocks.includes(IdSender) ?? false;

  //   return isReceiverBlocked || isSenderBlocker;
  // }


  // async BlockUser(userId: UUID, idOfBlockedUser: UUID): Promise<User> {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });

  //   if (!user)
  //     throw new Error("User Not Found!");
  //   if (!user.blocks.includes(idOfBlockedUser)) {
  //     user.blocks = [...user.blocks, idOfBlockedUser];
  //     return this.userRepository.save(user);
  //   }
  //   else {
  //     throw new Error("User already blocked!! :)");
  //   }
  // }

  // ====================================== Messages function ==========================================================================

  /**
   * addDirectMessage - add the messge to database.
   * @param senderId the sender
   * @param receiverId the receiver
   * @param content the content of the message
   */
  async addMessage(payload: any) {
    const directMessage = this.msgRepository.create({
      message: payload.message,
      recieverId: payload.recieverId ? payload.recieverId : null,
      senderId: payload.senderId ? payload.senderId : payload.from,
      cid: (payload.cid !== undefined) ? payload.cid : null,
      img: (payload.image !== undefined) ? payload.image : null,
      audio: (payload.audio !== undefined) ? payload.audio : null
    });
    return await this.msgRepository.save(directMessage);
  }

  /**
   * saveMessageRoom - function that add msg entitie to the database with channel ID included.
   * @param senderId the sender of the message
   * @param channelId the channel where the message will broadcasted.
   * @param content the content of the message
   */
  async saveMessageRoom(senderId: UUID, channelId: number, content: string): Promise<void> {
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
  async findAllMsg() {
    return await this.msgRepository.find();
  }

  async findOneMessage(id: number): Promise<Msg> {
    return await this.msgRepository.findOne({ where: { id } });
  }


  // ============================= Channel function =================================================================
  getId(userObject: any) {
    return userObject.user.id; // Access the id property within the nested user object
  }

  async leaveFromChannel(payload: any) {
      await this.channelUserRepository.delete({
        user: {id: payload.userId},
        channel: {id: payload.channelId}
      });
  }

  async isJoined(channelId: number, userId: string): Promise<boolean>{
    
    const users = this.channelService.getMembersOfChannel(channelId);
    let flag = false;
    const userIds = (await users).map(this.getId);
    
    userIds.forEach((id) => {
      if (id === userId)
      {
        flag = true;
      }
    })
    return flag;
  }

  async getChannel(channelId: number): Promise<Channel>
  {
    return await this.channelRepository.findOne({where: {id: channelId}});
  }

  /**
   * addNewChannelEntity - function that add a new entity to channel
   * @payload the data attribute of channel entity
   */

  // async addNewChannelEntity(payload: any)
  // {
  //   const ownerPromise: Promise<User> = this.userRepository.findOne(payload.ownerId);
  //   const newEntityChannel =  this.channelRepository.create({
  //     name: payload.channelName,
  //     private: payload.isPrivate,
  //     password: "password" in payload ? payload.password : null,
  //     // password: payload.password !== undefined ? payload.password : null,
  //     type: payload.channelType,
  //     owner: ownerPromise,
  //   });
  //   /*
  //     {
  //       channelName:
  //       isPrivate: bool,
  //       channelType:,
  //       ownerId,
  //       password: it can be exist it can be not.
  //     }
  //   */
  //   await this.channelRepository.save(newEntityChannel);
  // }

  async addNewChannelEntity(payload: any): Promise<Channel> {

    try {
      const newEntityChannel = new Channel();
      newEntityChannel.name = payload.channelName;
      newEntityChannel.private = payload.isPrivate;
      newEntityChannel.password = "password" in payload ? payload.password : null;
      newEntityChannel.type = payload.channelType;
      newEntityChannel.picture = payload.picture
      console.log("=> ", payload.picture);
      newEntityChannel.owner = Promise.resolve(payload.ownerId);
      // Save the new Channel entity
      const savedChannel = await this.channelRepository.save(newEntityChannel);
      return savedChannel;
    } catch (error) {
      console.error("Error adding new channel:", error);
    }
  }
  

  async addNewMemberToChannel(payload: any, role: string) {
    // Load user and channel entities
    console.log("payload.__owner__", payload.__owner__)
    console.log("payload.id", payload.id)
    console.log("-----------------------------------------------> joined");
    const id = payload.__owner__;
    const user = await this.userService.viewUser(id);
    const channel: Channel = await this.channelRepository.findOne({where: {id: payload.id}});
    // if (!user || !channel) {
    //   throw new Error('User or channel not found'); // Handle the case where user or channel is not found
    // }

    const newChannelUser = new ChannelUser();
    // newEntity.user = Promise.resolve(payload.__owner__.id);
    newChannelUser.user = Promise.resolve(user);
    newChannelUser.channel = Promise.resolve(channel);
    newChannelUser.role = (role !== "") ? role : payload.role

    // Save the new ChannelUser record
    await this.channelUserRepository.save(newChannelUser);
  }

  /**
   * kickUserFromChannel - kick a user from the channel.
   * @param payload userId and channelId from where the user will be kicked
   * in the channel-user entity.
   */
  async kickUserFromChannel(payload: any)
  {
    console.log("payload", payload);
    const targetedEntity = await this.channelUserRepository.findOne({
      where: {
        channel: {id: payload.channelId},
        user: {
          id: payload.target
        }
      },
      relations: ['user'],
    });
    if (targetedEntity)
    {
      await this.channelUserRepository.delete(targetedEntity.id);
    }
    else
      console.log("the user in channel-user relation is not found!!!");
  }

  async changeChannelType(payload: any)
  {
    const channelRecord = await this.channelRepository.findOne({where: {id: payload.channelId}});

    if (!channelRecord)
      throw new NotFoundException("The channel not found !");

    channelRecord.type = payload.channelType;
    if (payload.channelType === ChannelTypes.PROTECTED)
    {
      channelRecord.password = payload.password;
    }
    await this.channelRepository.save(channelRecord);
  }

  async promoteUser(payload: any)
  {
    const channelRecord = await this.channelRepository.findOne({where: {id: payload.channelId}});
    const userRecord = await this.userRepository.findOne({where: {id: payload.userId}});
    
    if (channelRecord === null || userRecord === null)
      throw new NotFoundException("the disire channel or user not found");
    const recordToUpdate = await this.channelUserRepository.findOne({where: {user: userRecord, channel: channelRecord}});
    if (recordToUpdate === null)
      throw new NotFoundException("the channel user record not found (updating role of the user in a channel)");
    recordToUpdate.role = payload.role;
    await this.channelUserRepository.save(recordToUpdate);
  }

  // =============================== Mute functions ================================================
  async muteUser(payload: any) {
    const newEntity = this.muteRepository.create({
      userId: payload.userId,
      cid: payload.channelId
    })

    await this.muteRepository.save(newEntity);
  }
}


