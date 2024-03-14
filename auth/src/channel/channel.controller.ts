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
    async getChannelsByUserId(@Param('userId') userId: UUID)
    {
        return this.channelService.getChannelsByUserId(userId);
    }

    @Get(':id/lastmessage')
    async getLastMessageOfChannel(@Param('id') channelId: number)
    {
        return this.channelService.getLastMessageOfChannel(channelId);
    }

    @Get(':id/allMessages')
    async getAllMessages(@Param('id') channelId: number)
    {
        return this.channelService.getAllMessages(channelId);
    }
}