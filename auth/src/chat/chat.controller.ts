import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/message'
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('chat')
export class ChatController {

  /**
   *
   */
  constructor(
    private readonly chatService: ChatService
  ) {
    
  }
    @Post()
    async createMessage(@Body() settingProfileDto : CreateUserDto) {
      await this.chatService.addMessage(settingProfileDto);
    }
}
