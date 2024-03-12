import { User } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/user/entities/channel.entity";
import { Repository } from "typeorm/repository/Repository";
import { UUID } from 'crypto';

@Injectable()
export class ChannelService {
    /**
     *
     */
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
    }

    async getChannels(): Promise<Channel[]> {
        return this.channelRepository.find();
    }


    async getChannelById(id: number): Promise<Channel> {
        return await this.channelRepository.findOne({where: {id: id}})
    }

    // async getMemmbersOfChannel(userId: UUID): Promise<Channel[]> {
    //     // const channel = await this.channelRepository.findOne(id, {relations: ['members']});
    //     // const user = await this.userRepository.findOne(userId, { relations: ['channels'] });
    //     const user = await this.userRepository.findOne({ where: {id: userId}, relations: ['channels'] });

    //     if (!user) {
    //       throw new NotFoundException(`User with ID ${userId} not found`);
    //     }
    
    //     const channels = await user.channels;
    
    //     return channels;
    // }

    // async getChannelsByUserId(userId: number): Promise<Channel[]> {
    //     return await this.channelRepository.find({where: { : userId}});
    // }
}