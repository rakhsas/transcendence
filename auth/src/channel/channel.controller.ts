import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { UUID } from 'crypto';
import { UserGuard } from 'src/guards/user.guard';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get(':id/users')
  @UseGuards(UserGuard)
  async getMembersOfChannel(@Param('id') channelId: number) {
    return this.channelService.getMembersOfChannel(channelId);
  }

  @Get(':userId/channels')
  @UseGuards(UserGuard)
  async getChannelsByUserId(@Param('userId') userId: UUID) {
    return this.channelService.getChannelsByUserId(userId);
  }

  @Get(':id/lastmessage')
  @UseGuards(UserGuard)
  async getLastMessageOfChannel(@Param('id') channelId: number) {
    return this.channelService.getLastMessageOfChannel(channelId);
  }

  @Get(':id/allMessages')
  @UseGuards(UserGuard)
  async getAllMessages(@Param('id') channelId: number) {
    return this.channelService.getAllMessages(channelId);
  }
}
