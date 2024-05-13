import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { UserGuard } from "src/guards/user.guard";

@Controller('messages')
export class MessageController {
    /**
     *
     */
    constructor(private readonly messageService: MessageService) {}

    @Get(':senderId')
	@UseGuards(UserGuard)
    async getLastMessages(@Param('senderId') senderId: string) {
        const messages = await this.messageService.getLastMessagesOfUsers(senderId);
        return messages;
    }
    
    @Get(':userId/:friendId')
    @UseGuards(UserGuard)
    async getMessages(@Param('userId')userId: string, @Param('friendId') friendId: string) {
        return await this.messageService.getMessages(userId, friendId);
    }
}