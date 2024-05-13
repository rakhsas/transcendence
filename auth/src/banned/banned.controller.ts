import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { Mute } from "src/user/model/user.model";
import { BannedService } from "./banned.service";
import { channel } from "diagnostics_channel";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { UserGuard } from "src/guards/user.guard";

@Controller("Banned")
@ApiTags("Banned")
export class BannedController {
    constructor(
        private readonly bannedService: BannedService
    ) {
    }

    @Get(':userId/:channelId')
	@UseGuards(UserGuard)
    async checkBan(@Param('userId')userId: string, @Param('channelId') channelId: number): Promise<Mute[]> {
        return await this.bannedService.checkBanned(userId, channelId);
    }

    @Get(':channelId')
	@UseGuards(UserGuard)
    async getBanned(@Param('channelId') channelId: number): Promise<Mute[]> {
        return await this.bannedService.getBannedUsers(channelId);
    }
}