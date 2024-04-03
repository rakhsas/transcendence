import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameEntity } from "src/user/entities/game.entity";
import { Repository } from "typeorm";


@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>
    ) {}

    async getGameRecord(userId: string, friendId: string) {
        return await this.gameRepository.find({where: [{
            player1: {id: userId},
            player2: {id: friendId}
        }],
        relations: ['player1', 'player2'],
    });
    }
}