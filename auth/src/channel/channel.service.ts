import { User } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel, ChannelTypes } from "src/user/entities/channel.entity";
import { Repository } from "typeorm/repository/Repository";
import { UUID, privateDecrypt } from 'crypto';
import { ChannelUser, UserRole } from 'src/user/entities/channel_member.entity';
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

    async getProtectedChannelsExpectUser(userId: string): Promise<Channel[]> {
        // Find all protected channels
        const allProtectedChannels = await this.channelRepository.find({
            where: {
                type: ChannelTypes.PROTECTED,
            },
        });
    
        // Find channels the user has joined
        const userJoinedChannels = await this.getUserJoinedChannels(userId);
    
        // Filter out channels the user has already joined
        const channelsNotJoinedByUser = allProtectedChannels.filter(channel => {
            return !userJoinedChannels.some(userChannel => userChannel.id === channel.id);
        });
    
        return channelsNotJoinedByUser;
    }

    async getUserJoinedChannels(userId: string): Promise<Channel[]> {
        const channelUsers = await this.channelUserRepository.find({
            where: {
                user: {id: userId}
            },
            relations: ['channel']
        });
        return await Promise.all(
            channelUsers.map(async (channelUser) => await channelUser.channel)
        )
    }

    async getPublicChannelsExpectUser(userId: string): Promise<Channel[]> {
        const allProtectedChannels = await this.channelRepository.find({
            where: {
                type: ChannelTypes.PUBLIC,
            },
        });
    
        // Find channels the user has joined
        const userJoinedChannels = await this.getUserJoinedChannels(userId);
    
        // Filter out channels the user has already joined
        const channelsNotJoinedByUser = allProtectedChannels.filter(channel => {
            return !userJoinedChannels.some(userChannel => userChannel.id === channel.id);
        });
    
        return channelsNotJoinedByUser;
    }

    async isUserInChannel(userId: string, channelId: number): Promise<boolean> {
        const channelUser = await this.channelUserRepository.findOne({
            where: {
                user: {id: userId},
                channel: {id: channelId}
            }
        });
        return !!channelUser;
    }

}