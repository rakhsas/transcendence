import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { Mute } from "src/user/model/user.model";
import { channel } from "diagnostics_channel";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { MuteService } from "./mute.service";
import { UserGuard } from "src/guards/user.guard";

@Controller("mute")
@ApiTags("Mute")
export class MuteController {
    constructor(
        private readonly muteService: MuteService
    ) {
    }

    @Get(':userId/:channelId')
	@UseGuards(UserGuard)
    async checkMute(@Param('userId')userId: string, @Param('channelId') channelId: number): Promise<Mute[]> {
        return await this.muteService.checkMute(userId, channelId);
    }

    @Get(':channelId')
	@UseGuards(UserGuard)
    async getMutedUsers(@Param('channelId') channelId: number): Promise<Mute[]> {
        return await this.muteService.getMutedUsers(channelId);
    }
}