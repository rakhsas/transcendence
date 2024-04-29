import { Controller, Get, Param } from "@nestjs/common";
import { Mute } from "src/user/model/user.model";
import { channel } from "diagnostics_channel";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { BlockedService } from "./blocked.service";
import { Blocked } from "src/user/entities/blocked.entity";

@Controller("Blocked")
@ApiTags("Block")
export class BlockedController {
    constructor(
        private readonly blockedService: BlockedService
    ) {
    }

    @Get(':userId/:friendId')
    async checkBlock(@Param('userId')userId: string, @Param('friendId') blockedUserId: string): Promise<boolean> {
        return (await this.blockedService.checkBlocked(userId, blockedUserId)) ? true : false;
    }

    @Get('between/:userId/:friendId')
    async checkBlockBetween(@Param('userId')userId: string, @Param('friendId') blockedUserId: string): Promise<boolean> {
        return (await this.blockedService.checkBlockBetween(userId, blockedUserId)) ? true : false;
    }
}
