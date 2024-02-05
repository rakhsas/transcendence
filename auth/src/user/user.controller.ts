import { Controller, Get, UseGuards, Req, Post, Patch, Param, Body, Delete, UsePipes, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.user';
import { CreateUserDto } from './dto/create.user';
import { ApiBody, ApiExtraModels, ApiOkResponse, ApiResponse, getSchemaPath, refs } from '@nestjs/swagger';
import { ValidationPipe } from './validators/validation.pipe';
import { ValidationFilter } from './validators/validation.pipe';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiOkResponse({ description: 'User Created', type: CreateUserDto})
	@ApiBody({ type: CreateUserDto, description: 'Create User', required: true,})
	@ApiResponse({ status: 201, description: 'User Created', type: CreateUserDto})
	@UsePipes(ValidationPipe)
	@UseFilters(ValidationFilter)
	async createUser(@Body() createUserDto: CreateUserDto) {
			return this.userService.createUser(createUserDto);
	}
	
	@Get()
	findAllUsers() {
		return this.userService.findAllUsers();
	}

	@Get(':id')
	findUser(@Param('id') id: string) {
		return this.userService.viewUser(id);
	}

	@Patch(':id')
	UpdateUser(@Param('id') id: string, @Body() updatedUser: UpdateUserDto) {
		return this.userService.updateUser(id, updatedUser);
	}

	@Delete(':id')
	deleteUser(@Param('id') id: string) {
		return this.userService.deleteUser(+id);
	}
}