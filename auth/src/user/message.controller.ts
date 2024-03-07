import { Controller, Get, Param } from "@nestjs/common";
import { MessageService } from "./message.service";

@Controller('messages')
export class MessageController {
    /**
     *
     */
    constructor(private readonly messageService: MessageService) {}


    @Get()
    async latestMessages() {
        // const messages = await this.messageService.latestMessages();
        const messages = await this.messageService.getLastMessagesOfUsers();
        return messages;
    }


    @Get(':senderId/:friendId')
    async getMessages(@Param('senderId') senderId: string, @Param('friendId') recieverId: string){
        const messages = await this.messageService.getMessages(senderId, recieverId);
        return messages;
    }
}