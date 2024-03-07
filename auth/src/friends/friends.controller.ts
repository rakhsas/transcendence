import { Controller, Get, Param } from "@nestjs/common";
import { FriendService } from "./friends.service";
import { UUID } from "crypto";

@Controller('friends')
export class friendController {

    constructor(private readonly friendService: FriendService) {}

    @Get(':userId')
    async getFriendsOfUser(@Param('userId') userId: UUID)
    {
        return this.friendService.getFriends(userId);
    }
}