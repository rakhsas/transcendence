import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/createGameDto';
import { UserGuard } from 'src/guards/user.guard';

@Controller('game-getway')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
	@UseGuards(UserGuard)
  async creeateFriendship(@Body() gameDto: CreateGameDto) {
    // this.friendService.createFriendship(friendId, userId);
    return this.gameService.addGame(gameDto);
  }
}
