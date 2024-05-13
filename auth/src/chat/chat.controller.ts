import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/message'
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/guards/user.guard';

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
	  @UseGuards(UserGuard)
  async createMessage(@Body() settingProfileDto : CreateUserDto) {
      await this.chatService.addMessage(settingProfileDto);
    }
}
