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

    // @Get(':userId')
    // async 
}