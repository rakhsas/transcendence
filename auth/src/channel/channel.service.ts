import { User } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/user/entities/channel.entity";
import { Repository } from "typeorm/repository/Repository";
import { UUID, privateDecrypt } from 'crypto';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChannelService {
    /**
     *
     */
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
        @InjectRepository(ChannelUser)
        private channelUserRepository: Repository<ChannelUser>
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
        const users = channelUsers.map((channelUser) => ({
            user: channelUser.user,
            role: channelUser.role, // 
        }));

        return users;
    }

    async getChannelsByUserId(userId: string): Promise<{}[]> {
        const userChannels =  await this.channelUserRepository.find({
            where: {user: {id: userId}},
            relations: ['channel']
        });

        // const channels = userChannels.map((channelUser) => channelUser.channel);
        const channels = userChannels.map((channelUser) => ({
            channel: channelUser.channel,
            role: channelUser.role,
        }));

        return channels;
    }
}