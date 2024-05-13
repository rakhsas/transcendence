import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { UserGuard } from "src/guards/user.guard";
import { AnalyticsService } from "./analytics.service";
import { User } from "src/user/entities/user.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('game')
@Controller('analytics')
export class AnalyticsController {
    
    constructor(private readonly analyticsService: AnalyticsService) {}



    @Get('allGame/:userId')
	@UseGuards(UserGuard)
    async getAllGame(@Param('userId') userId: string)
    {
        return this.analyticsService.getAllGame(userId);
    }
    
    @Get('lastSevenDays/:playerId')
	@UseGuards(UserGuard)
    async getGamesPlayedByPlayerInLastSevenDays(
        @Param('playerId') playerId: string,
    ): Promise<number[]> {
        const gamesPlayed = await this.analyticsService.getGamesPlayedByPlayerInLastSevenDays(playerId);
        return gamesPlayed;
    }

    @Get('top3')
	@UseGuards(UserGuard)
    async getPlayerByScore(): Promise<User[]> {
        return this.analyticsService.getPlayerByScore();
    }

    @Get('lastGame/:userId')
	@UseGuards(UserGuard)
    async getLastGame(@Param('userId') userId: string)
    {
        return this.analyticsService.getLastGame(userId);
    }

    @Get("allPlayers")
	@UseGuards(UserGuard)
    async getAllPlayers() {
        return this.analyticsService.getAllPlayers();
    }
    
    @Get(':userId/:friendId')
	@UseGuards(UserGuard)
    async getGameRecord(@Param('userId')userId: string, @Param('friendId')friendId: string,)
    {
        return this.analyticsService.getGameRecord(userId, friendId);
    }


    @Get(':id')
	@UseGuards(UserGuard)
    async profileData(@Param('id') userId: string)
    {
        return this.analyticsService.profileData(userId);
    }
}