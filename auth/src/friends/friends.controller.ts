import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FriendService } from "./friends.service";
import { CreateFriendshipDto } from "./dto/create-friendship.dto";
import { ApiBody, ApiExtraModels, ApiOkResponse, ApiResponse, ApiTags, getSchemaPath, refs } from '@nestjs/swagger';

import { UUID } from "crypto";
import { ApiParam } from "@nestjs/swagger";
import { UserGuard } from "src/guards/user.guard";
@ApiTags('friends')
@Controller('friends')
export class friendController {

    constructor(private readonly friendService: FriendService) {}

    @Get(':userId')
    // @UseGuards(UserGuard)
    @ApiParam({ name: 'userId', description: 'ID of the user' })
	@UseGuards(UserGuard)
    async getFriendsOfUser(@Param('userId')userId: string)
    {
        return this.friendService.getFriends(userId);
    }
    
    @Post(':userId/:friendId')
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    @ApiParam({ name: 'friendId', description: 'ID of the user' })
    @UseGuards(UserGuard)
    async creeateFriendship(@Param('userId')userId: string, @Param('friendId')friendId: string,)
    {
        // this.friendService.createFriendship(friendId, userId);
        return this.friendService.createFriendship(userId, friendId);
    }

    @Get('friendship/:userId/:friendId')
    // @UseGuards(UserGuard)
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    @ApiParam({ name: 'friendId', description: 'ID of the user' })
	@UseGuards(UserGuard)
    async getFriendship(@Param('userId')userId: string, @Param('friendId')friendId: string)
    {
        return this.friendService.getFriendship(userId, friendId);
    }
}