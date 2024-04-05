import { Controller, Get, Param } from "@nestjs/common";
import { Mute } from "src/user/model/user.model";
import { channel } from "diagnostics_channel";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { MuteService } from "./mute.service";

@Controller("mute")
@ApiTags("Mute")
export class MuteController {
    constructor(
        private readonly muteService: MuteService
    ) {
    }

    @Get(':userId/:channelId')
    async checkMute(@Param('userId')userId: string, @Param('channelId') channelId: number): Promise<Mute[]> {
        return await this.muteService.checkMute(userId, channelId);
    }

    @Get(':channelId')
    async getMutedUsers(@Param('channelId') channelId: number): Promise<Mute[]> {
        return await this.muteService.getMutedUsers(channelId);
    }
}