import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';

@Controller('msg.controller')
export class MsgController {

    constructor(private readonly chatService: ChatService) {}

    @Get()
    async findAll() {
        return await this.chatService.findAllMsg();
    }

    @Get(':id')
    async findOneMsg(@Param('id') id: number)
    {
        return await this.chatService.findOneMessage(id);
    }
}
