import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Banned } from "src/user/entities/ban.entity";
import { Blocked } from "src/user/entities/blocked.entity";
import { Mute } from "src/user/entities/mute.entity";
import { User } from "src/user/entities/user.entity";
import { Between, Repository } from "typeorm";


@Injectable()
export class BlockedService {
    constructor(
        @InjectRepository(Blocked)
        private readonly blockedRepository: Repository<Blocked>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
    ) {}
    

    async checkBlocked(userId: string, blockedUserId: string): Promise<Blocked> {
        return await this.blockedRepository.findOne({
            where: {
                user: {id: userId},
                blockedUser: {id: blockedUserId}
            },
            relations: ['user', 'blockedUser']
        });
    }

}