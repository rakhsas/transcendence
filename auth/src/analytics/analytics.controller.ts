import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserGuard } from "src/guards/user.guard";
import { AnalyticsService } from "./analytics.service";

@Controller('analytics')
export class AnalyticsController {
    
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get(':userId/:friendId')
    // @UseGuards(UserGuard)
    async getGameRecord(@Param('userId')userId: string, @Param('friendId')friendId: string,)
    {
        return this.analyticsService.getGameRecord(userId, friendId);
    }

    @Get('userId')
    async profileData(@Param('userId') userId: string)
    {
        return this.analyticsService.profileData(userId);
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