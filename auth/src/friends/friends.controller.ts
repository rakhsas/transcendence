import { Controller, Get, Param, Post } from "@nestjs/common";
import { FriendService } from "./friends.service";
import { UUID } from "crypto";
import { ApiParam } from "@nestjs/swagger";

@Controller('friends')
export class friendController {

    constructor(private readonly friendService: FriendService) {}

    @Get(':userId')
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    async getFriendsOfUser(@Param('userId')userId: string,)
    {
        return this.friendService.getFriends(userId);
    }
    
    // @Post(':userId/:friendId')
    // @ApiParam({ name: 'userId', description: 'ID of the user' })
    // @ApiParam({ name: 'friendId', description: 'ID of the user' })
    // async creeateFriendship(@Param('userId')userId: string, @Param('friendId')friendId: string,)
    // {
    //     this.friendService.createFriendship(friendId, userId);
    //     return this.friendService.createFriendship(userId, friendId);
    // }

    // @Get(':userId')
    // @ApiParam({ name: 'userId', description: 'ID of the user' })
    // async getFriendship(@Param('userId')userId: string)
    // {
    //     return this.friendService.getFriendsOfUser(userId);
    // }
}