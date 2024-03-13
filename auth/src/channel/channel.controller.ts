import { Controller, Get, Param } from "@nestjs/common";
import { ChannelService } from './channel.service';
import { UUID } from "crypto";

@Controller('channels')
export class ChannelController {

    
    constructor(private readonly channelService: ChannelService) {}

    @Get(':id/users')
    async getMembersOfChannel(@Param('id') channelId: number)
    {
        return this.channelService.getMembersOfChannel(channelId);
    }

    @Get(':userId/channels')
    async getChannelsByUserId(@Param('userId') userId: string)
    {
        return this.channelService.getChannelsByUserId(userId);
    }

}