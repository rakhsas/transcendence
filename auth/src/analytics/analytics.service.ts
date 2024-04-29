import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameEntity } from "src/user/entities/game.entity";
import { User } from "src/user/entities/user.entity";
import { Between, Repository } from "typeorm";


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

    async getLastGame(userId: string) {
        return this.gameRepository.find({
            where: {player1: {id: userId}},
            order: {
                ["finishedAt"]: 'DESC', // or 'DESC' depending on your requirement
              },
            take: 1,
        });
    }

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
        const gamePlayed = await this.gameRepository
        .createQueryBuilder('game')
        .leftJoin('game.player1', 'player1')
        .where("player1.id = :userId", { userId })
        .getCount();

        const gameWon = await this.gameRepository
        .createQueryBuilder('game')
        .leftJoin('game.winner', 'winner')
        .where('winner.id = :userId', {userId})
        .andWhere('game.player1.id = :userId', {userId})
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



    async getGamesPlayedByPlayerInLastSevenDays(playerId: string): Promise<number[]> {
        const currentDate = new Date();
        const pastSevenDays = [];

        // Generate past seven days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            pastSevenDays.push(date);
        }

        const gamesPlayedPromises = pastSevenDays.map(async (date) => {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const games = await this.gameRepository.count({
                where: {
                    player1:{id: playerId},
                    finishedAt: Between(startOfDay, endOfDay),
                },
            });
            //console.log("------------>: " , games);
            return games;
        });

        const gamesPlayed = await Promise.all(gamesPlayedPromises);
        return gamesPlayed;
    }
}