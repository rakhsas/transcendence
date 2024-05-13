import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { Mute } from "src/user/model/user.model";
import { channel } from "diagnostics_channel";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { BlockedService } from "./blocked.service";
import { Blocked } from "src/user/entities/blocked.entity";
import { UserGuard } from "src/guards/user.guard";

@Controller("Blocked")
@ApiTags("Block")
export class BlockedController {
    constructor(
        private readonly blockedService: BlockedService
    ) {
    }

    @Get(':userId/:friendId')
	@UseGuards(UserGuard)
    async checkBlock(@Param('userId')userId: string, @Param('friendId') blockedUserId: string): Promise<boolean> {
        return (await this.blockedService.checkBlocked(userId, blockedUserId)) ? true : false;
    }

    @Get('between/:userId/:friendId')
	@UseGuards(UserGuard)
    async checkBlockBetween(@Param('userId')userId: string, @Param('friendId') blockedUserId: string): Promise<boolean> {
        return (await this.blockedService.checkBlockBetween(userId, blockedUserId)) ? true : false;
    }
}
