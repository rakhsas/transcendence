import { Controller, Get, Post, Delete, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    async getAllUsers() {
        console.log("are you here");
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') userId: string)
    {
        return this.userService.getUserById(+userId);
    }

    @Post()
    async createUser(@Body() userData: any)
    {
        return this.userService.createUser(userData);
    }

    @Put(':id')
    async updateUser(@Param('id') userId: string, @Body() userData: any)
    {
        return this.userService.updateUser(+userId, userData);
    }

    @Delete(':id')
    async deleteUser(userId: string)
    {
        return this.userService.deleteUser(+userId)
    }
}
