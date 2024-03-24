import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ChannelService } from './channel.service';
import { UUID } from "crypto";
import { UserGuard } from "src/guards/user.guard";
import { ApiParam } from "@nestjs/swagger";

@Controller('channels')
export class ChannelController {

    
    constructor(private readonly channelService: ChannelService) {}
    
    @Get(':userId')
    @ApiParam({ name: 'userId', type: 'string', format: 'uuid' }) // Adjust type/format if needed
    async getChannelsByUserId(@Param('userId') userId: UUID)
    {
        return await this.channelService.getChannelsByUserId(userId);
    }

    @Get('lastMessage/:userId')
    @UseGuards(UserGuard)
    @ApiParam({ name: 'userId', type: 'string', format: 'uuid'})
    async getChannelsLastMessageByUserIdAndLastMessage(@Param('userId') userId: UUID)
    {
        return await this.channelService.getChannelsLastMessageByUserIdAndLastMessage(userId);
    }

    @Get(':id/users')
    // @UseGuards(UserGuard)
    async getMembersOfChannel(@Param('id') channelId: number)
    {
        return await this.channelService.getMembersOfChannel(channelId);
    }
    
    
    @Get(':id/lastmessage')
    // @UseGuards(UserGuard)
    async getLastMessageOfChannel(@Param('id') channelId: number)
    {
        return await this.channelService.getLastMessageOfChannel(channelId);
    }
    
    @Get(':id/allMessages')
    @UseGuards(UserGuard)
    async getAllMessages(@Param('id') channelId: number)
    {
        return await this.channelService.getAllMessages(channelId);
    }
}