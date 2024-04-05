import { Controller, Get, Param } from "@nestjs/common";
import { Mute } from "src/user/model/user.model";
import { channel } from "diagnostics_channel";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { BlockedService } from "./blocked.service";

@Controller("Banned")
@ApiTags("Banned")
export class BlockedController {
    constructor(
        private readonly blockedService: BlockedService
    ) {
    }

    @Get(':userId/:channelId')
    async checkMute(@Param('userId')userId: string, @Param('channelId') blockedUserId: string): Promise<Mute[]> {
        return await this.blockedService.checkBlocked(userId, blockedUserId);
    }
}