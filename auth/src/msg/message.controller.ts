import { Controller, Get, Param } from "@nestjs/common";
import { MessageService } from "./message.service";

@Controller('messages')
export class MessageController {
    /**
     *
     */
    constructor(private readonly messageService: MessageService) {}


    // @Get()
    // async latestMessages() {
    //     // const messages = await this.messageService.latestMessages();
    //     const messages = await this.messageService.getLastMessagesOfUsers();
    //     return messages;
    // }


    @Get(':senderId')
    async getLastMessages(@Param('senderId') senderId: string){
        const messages = await this.messageService.getLastMessagesOfUsers(senderId);
        return messages;
    }

    @Get(':userId/:friendId')
    async getMessages(@Param('userId')userId: string, @Param('friendId') friendId: string) {
        console.log('here')
        return await this.messageService.getMessages(userId, friendId);
    }
}