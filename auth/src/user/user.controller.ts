import { Controller, Get, UseGuards, Req, Res, Post, Patch, Param, Body, Delete, UsePipes, UseFilters, Put, ParseArrayPipe, HttpException, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.user';
import { CreateUserDto } from './dto/create.user';
import { ApiBody, ApiConsumes, ApiExtraModels, ApiOkResponse, ApiParam, ApiResponse, ApiTags, getSchemaPath, refs } from '@nestjs/swagger';
import { ValidationPipe } from './validators/validation.pipe';
import { ValidationFilter } from './validators/validation.pipe';
import { UserGuard } from '../guards/user.guard';
import { SettingProfileDto } from './dto/setting.user';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadController } from 'src/upload/upload.controller';
import * as https from 'https';
import axios from 'axios';
// import * as FormData from 'form-data';
import FormData from "form-data";

@ApiTags('user')
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		) {}
	UPLOAD_API_URL = process.env.HOST + 'upload';

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

	@Put('picture/:userId')
	@ApiParam({ name: 'userId', required: true, description: 'User ID' })
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	async updatePicture(@Param('userId') id: string, @UploadedFile() file: Express.Multer.File) {
		if (!file) {
			console.log('No file uploaded!');
			throw new BadRequestException('No file uploaded!');
		}
		try {
			const pictureUrl = await this.uploadFile(file);
			return await this.userService.update(id, { picture: pictureUrl });
		} catch (error) {
			console.error('Error updating picture:', error);
			throw new InternalServerErrorException('Failed to update picture.');
		}
	}

	@Put('info/:username/:userId')
	@ApiParam({ name: 'username', required: true, description: 'Username' })
	@ApiParam({ name: 'userId', required: true, description: 'User ID' })
	async updateUsername(@Param('username') username: string, @Param('userId') userId: string) {
		return await this.userService.updateUsername(username, userId);
	}

	@Put(":userId")
	@ApiParam({ name: 'userId', required: true, description: 'User ID' })
	@ApiBody({ type: UpdateUserDto, description: 'Update User', required: true,})
	async updateUser(@Param('userId') id: string, @Body() updateUserDto: Partial<User>) {
		return await this.userService.update(id, updateUserDto);
	}

	async uploadFile(file: Express.Multer.File) {
		try {
			const formData: FormData  = new FormData();
			formData.append('file', file.buffer, file.originalname);
			console.log('Uploading file:', formData);
			const response = await axios.post(this.UPLOAD_API_URL, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				httpsAgent: new https.Agent({ rejectUnauthorized: false })
			});
			return response.data.url;
		} catch (error) {
			console.error('Error uploading file:', error);
			throw new InternalServerErrorException('Failed to upload file.');
		}
	}

	@Put("2fa/disable2FA/:userId")
	@ApiParam({ name: 'userId', required: true, description: 'User ID' })
    async update2FA(@Param('userId') id: string) {
		console.log("id: ", id);
        return this.userService.update2FAState(id, false);
    }
	
	@Put("2fa/enable2FA/:userId")
	@ApiParam({ name: 'userId', required: true, description: 'User ID' })
    async enable2FA(@Param('userId') id: string) {
		//console.log("id: ", id);
        return this.userService.update2FAState(id, true);
    }
}