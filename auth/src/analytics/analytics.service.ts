import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameEntity } from "src/user/entities/game.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
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

    async getAllGame(userId: string): Promise<GameEntity[]> {
        const allGames = this.gameRepository.find(
            {
                where: {player1: {id: userId}},
                relations: ['player1', 'player2', 'winner']
            });
        return allGames;
    }

    async getAllPlayers() {
        return await this.userRepository.find({
            order: {
                ["score"]: 'DESC', // or 'DESC' depending on your requirement
              },
        });
    }

    async profileData(userId: string): Promise<{}> {
        console.log("userId1: ", userId);
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

        const gameWithMaxScore = await this.gameRepository
        .createQueryBuilder('game')
        .leftJoin('game.player1', 'player1')
        .where('player1.id = :userId', {userId})
        .andWhere('game.user_score = :scoore', {scoore: 5})
        .andWhere("game.player_score = :scoore2", {scoore2: 0})
        .getCount();

        return {
            "gamePlayed": gamePlayed,
            "gameWon": gameWon,
            "gameWithMaxScore": gameWithMaxScore,
        };

    }

    async getPlayerByScore(){
        return await this.userRepository.find({
            order: {
                ["score"]: 'DESC', // or 'DESC' depending on your requirement
              },
              take: 3, 
        });
    }
}