import { User } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel, ChannelTypes } from "src/user/entities/channel.entity";
import { Repository } from "typeorm/repository/Repository";
import { UUID, privateDecrypt } from 'crypto';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { channel } from 'diagnostics_channel';
import { Msg } from 'src/user/entities/msg.entitiy';

@Injectable()
export class ChannelService {
    /**
     *
     */
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
        @InjectRepository(ChannelUser)
        private channelUserRepository: Repository<ChannelUser>,
        @InjectRepository(Msg)
        private msgRepository: Repository<Msg>
        // @InjectRepository(User)
        // private userRepository: Repository<User>
    ) {
    }

    async getChannels(): Promise<Channel[]> {
        return this.channelRepository.find();
    }


    async getChannelById(id: number): Promise<Channel> {
        return await this.channelRepository.findOne({where: {id: id}})
    }

    async getMembersOfChannel(channelId: number): Promise<{}[]> {
        const channelUsers = await this.channelUserRepository.find({
            where: {channel: {id: channelId}},
            relations: ['user']
        })
        // const users = channelUsers.map((channelUser) => channelUser.user);
        const users = await Promise.all(
            channelUsers.map(async (channelUser) => ({
               user: await channelUser.user,
               role: channelUser.role,
            }))
        )
        return users;
    }

    async getChannelsByUserId(userId: UUID): Promise<{}[]> {
        const userChannels =  await this.channelUserRepository.find({
            where: {user: {id: userId}},
            relations: ['channel']
        });

        const channels = await Promise.all(
            userChannels.map(async (channelUser) => ({
                channel: await channelUser.channel,
                role: channelUser.role,
            }))
        );
        return channels;
    }

    async getLastMessageOfChannel(channelId: number): Promise<{}>{
        return await this.msgRepository.createQueryBuilder('msg')
      .where('msg.cid = :channelId', { channelId })
      .orderBy('msg.date', 'DESC')
      .limit(1)
      .getOne();
    }

    async getAllMessages(channelId: number): Promise<Msg[]>{
        return this.msgRepository.createQueryBuilder('msg')
        .where('msg.cid = :channelId', {channelId})
        .getMany()
    }

    async getChannelsLastMessageByUserIdAndLastMessage(userId: string): Promise<{}> {
        const userChannels =  await this.channelUserRepository.find({
            where: {user: {id: userId}},
            relations: ['channel']
        });

        const fullchannels = await Promise.all(
            userChannels.map(async (channelUser) => ({
               channel: await channelUser,
               lastMessage: await this.getLastMessageOfChannel((await channelUser.channel).id)
           }))
        )
        return fullchannels;   
    }
    
    async getProtectedChannels() {
        return await this.channelRepository.find({
            where: {
                type: ChannelTypes.PROTECTED
            }
        })
    }

    async getProtectedChannelsExpectUser(userId: UUID): Promise<Channel[]> {
        // Find all protected channels
        const channels = await this.channelRepository.find({
            where: {
                type: ChannelTypes.PROTECTED,
            },
        });

        // Find channels where the user is already a member
        const userChannels = await this.channelUserRepository.find({
            where: { user: { id: userId } },
            relations: ['channel'],
        });

        const userChannelIds = userChannels.map(channelUser => channelUser.channel.id);

        // Filter out channels where the user is already a member or the channel owner is the user ID
        const filteredChannels = channels.filter(async channel => {
            const owner = await channel.owner; // Await the owner promise
            return !(await this.isMemberOfChannel(userId, channel)) && owner.id !== userId;
        });

        return filteredChannels;
    }

    async isMemberOfChannel(userId: UUID, channel: Channel): Promise<boolean> {
        const channelUsers = await channel.users;
        return channelUsers.some(channelUser => channelUser.user.id === userId);
    }
}