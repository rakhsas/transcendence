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

    // async gameCounts(userId: string) : Promise<number> {
    //     const count = await this.gameRepository
    //     .createQueryBuilder('game')
    //     .leftJoin('game.player1', 'player1')
    //     .where("player1.id = :userId", { userId })
    //     .getCount();
        
    //     return count;
    // }

    async profileData(userId: string): Promise<{}> {
        const gamePlayed = await this.gameRepository
        .createQueryBuilder('game')
        .leftJoin('game.player1', 'player1')
        .where("player1.id = :userId", { userId })
        .getCount();

        const gameWon = await this.gameRepository
        .createQueryBuilder('game')
        .leftJoin('game.winner', 'winner')
        .where('winner.id = :userId', {userId})
        .getCount();

        const gameWithMaxScoore = await this.gameRepository
        .createQueryBuilder('game')
        .leftJoin('game.player1', 'player1')
        .where('player1.id = :userId', {userId})
        .where('game.user_scoore = :scoore', {scoore: 5})
        .where("game.player_scoore = :scoore2", {scoore2: 0})
        .getCount();


        return {
            "gamePlayed": gamePlayed,
            "gameWon": gameWon,
            "gameWithMaxScoore": gameWithMaxScoore,
        };

    }
}