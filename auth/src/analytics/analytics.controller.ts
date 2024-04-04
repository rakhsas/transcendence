import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserGuard } from "src/guards/user.guard";
import { AnalyticsService } from "./analytics.service";
import { User } from "src/user/entities/user.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('game')
@Controller('analytics')
export class AnalyticsController {
    
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get('allGame/:userId')
    async getAllGame(@Param('userId') userId: string)
    {
        return this.analyticsService.getAllGame(userId);
    }
    
    @Get('lastGame/:userId')
    async getLastGame(@Param('userId') userId: string)
    {
        return this.analyticsService.getLastGame(userId);
    }

    @Get("allPlayers")
    async getAllPlayers() {
        return this.analyticsService.getAllPlayers();
    }
    
    @Get(':userId/:friendId')
    // @UseGuards(UserGuard)
    async getGameRecord(@Param('userId')userId: string, @Param('friendId')friendId: string,)
    {
        return this.analyticsService.getGameRecord(userId, friendId);
    }


    @Get(':id')
    async profileData(@Param('id') userId: string,)
    {
        return this.analyticsService.profileData(userId);
    }

   

    @Get()
    async getPlayerByScore(): Promise<User[]> {
        return this.analyticsService.getPlayerByScore();
    }

    // @Get('gameCount/:userId')
    // async gameCount(@Param('userId') userId: string){
    //     const count = this.analyticsService.gameCounts(userId);
    //     return count;
    // }

    // @Get('gameWin/:userId')
    // async gameWon(@Param('userId') userId: string)
    // {
    //     const count = this.analyticsService.gameWon(userId);
    //     return count;
    // }
}