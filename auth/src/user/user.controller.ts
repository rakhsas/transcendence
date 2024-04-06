import { Controller, Get, UseGuards, Req, Res, Post, Patch, Param, Body, Delete, UsePipes, UseFilters, Put, ParseArrayPipe, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.user';
import { CreateUserDto } from './dto/create.user';
import { ApiBody, ApiExtraModels, ApiOkResponse, ApiResponse, ApiTags, getSchemaPath, refs } from '@nestjs/swagger';
import { ValidationPipe } from './validators/validation.pipe';
import { ValidationFilter } from './validators/validation.pipe';
import { UserGuard } from '../guards/user.guard';
import { SettingProfileDto } from './dto/setting.user';

@ApiTags('user')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}


	@Put("disable2FA/:userId")
    // @UseGuards(UserGuard)
    async update2FAState(@Param('userId') id: string) {
		//console.log("id: ", id);
        return this.userService.update2FAState(id);
    }

	@Put('settingProfile/:id')
  	async updateSettingProfile(@Param('id') id: string, @Body() settingProfileDto : SettingProfileDto) {
		//console.log("id and body, ", id, settingProfileDto);
      const updatedData = await this.userService.updateUserSetting(id, settingProfileDto);
      return updatedData;
  	}
	
	@Post()
	@ApiOkResponse({ description: 'User Created', type: CreateUserDto})
	@ApiBody({ type: CreateUserDto, description: 'Create User', required: true,})
	@ApiResponse({ status: 201, description: 'User Created', type: CreateUserDto})
	@UsePipes(ValidationPipe)
	@UseFilters(ValidationFilter)
	async createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(createUserDto);
	}
	
	

	@Get('all')
	@UseGuards(UserGuard)
	findAllUsers() {
		return this.userService.findAllUsers();
	}

	@Get(':id')
	@UseGuards(UserGuard)
	async findUser(@Param('id') id: string) {
		return await this.userService.viewUser(id);
	}
	

	@Get('all/:id')
	@UseGuards(UserGuard)
	async getAllUsersExcept(@Param('id') id: string) {
		return await this.userService.findAllUsersExcept(id);
	}

	@Put(':username/:userId')
	// @UseGuards(UserGuard)
	async updateUsername(@Param('username') username: string, @Param('userId') userId: string) {
		return await this.userService.updateUsername(username, userId);
	}

	
	
	// @Patch(':id')
	// @UseGuards(UserGuard)
	// UpdateUser(@Param('id') id: string, @Body() updatedUser: UpdateUserDto) {
	// 	return this.userService.update(id, updatedUser);
	// }
	
	// @Delete(':id')
	// @UseGuards(UserGuard)
	// deleteUser(@Param('id') id: number) {
	// 	return this.userService.deleteUser(+id);
	// }
}