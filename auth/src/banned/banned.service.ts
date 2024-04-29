import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Banned } from "src/user/entities/ban.entity";
import { Mute } from "src/user/entities/mute.entity";
import { User } from "src/user/entities/user.entity";
import { Between, Repository } from "typeorm";


@Injectable()
export class BannedService {
    constructor(
        @InjectRepository(Banned)
        private readonly bannedRepository: Repository<Banned>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
    ) {}
    

    async checkBanned(userId: string, channelId: number) {
        return this.bannedRepository.find({
            where: {
                user: {id: userId},
                channel: {id: channelId},
            }
        });
    }

    async getBannedUsers(channelId: number) {
        return this.bannedRepository.find({
            where: {
                channel: {id: channelId},
            },
            loadRelationIds: true
        })
    }

}