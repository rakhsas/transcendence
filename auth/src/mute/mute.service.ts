import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Mute } from "src/user/entities/mute.entity";
import { User } from "src/user/entities/user.entity";
import { Between, Repository } from "typeorm";


@Injectable()
export class MuteService {
    constructor(
        @InjectRepository(Mute)
        private readonly muteRepository: Repository<Mute>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
    ) {}
    

    async checkMute(userId: string, channelId: number) {
        return this.muteRepository.find({
            where: {
                muted: {id: userId},
                channel: {id: channelId},
            }
        });
    }

    async getMutedUsers(channelId: number) {
        return this.muteRepository.find({
            where: {
                channel: {id: channelId},
            }
        });
    }
}