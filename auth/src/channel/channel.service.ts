import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/user/entities/channel.entity";
import { User } from "src/user/model/user.model";
import { Repository } from "typeorm/repository/Repository";

@Injectable()
export class ChannelService {
    /**
     *
     */
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>
    ) {
    }

    async getChannels(): Promise<Channel[]> {
        return this.channelRepository.find();
    }


    async getChannelById(id: number): Promise<Channel> {
        return await this.channelRepository.findOne({where: {id: id}})
    }

    // async getMemmbersOfChannel(id: number): Promise<User[]> {
    //     return await this.channelRepository.findOne({where: {id: id}, relations: ['members']}).then(channel => channel);
    // }

    // async getChannelsByUserId(userId: number): Promise<Channel[]> {
    //     return await this.channelRepository.find({where: { : userId}});
    // }
}