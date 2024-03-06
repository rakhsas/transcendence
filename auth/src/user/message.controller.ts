import { Controller, Get } from "@nestjs/common";
import { MessageService } from "./message.service";

@Controller('messages')
export class MessageController {
    /**
     *
     */
    constructor(private readonly messageService: MessageService) {}


    @Get()
    async latestMessages() {
        const messages = await this.messageService.latestMessages();
        console.log(messages);
        return messages;
    }

}