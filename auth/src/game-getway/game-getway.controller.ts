import { Body, Controller, Param, Post } from '@nestjs/common';
import { GameGetwayService } from './game-getway.service';
import { CreateGameDto } from './dto/createGameDto';

@Controller('game-getway')
export class GameGetwayController {
    constructor(private readonly gameService: GameGetwayService) {}

    @Post()
    async creeateFriendship(@Body() gameDto: CreateGameDto)
    {
        // this.friendService.createFriendship(friendId, userId);
        return this.gameService.addGame(gameDto);
    }
}
