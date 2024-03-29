import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/createGameDto';

@Controller('game-getway')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async creeateFriendship(@Body() gameDto: CreateGameDto) {
    // this.friendService.createFriendship(friendId, userId);
    return this.gameService.addGame(gameDto);
  }
}
