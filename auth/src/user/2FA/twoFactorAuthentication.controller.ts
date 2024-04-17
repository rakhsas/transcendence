import {
	ClassSerializerInterceptor,
	Controller,
	Header,
	Post,
	UseInterceptors,
	Res,
	UseGuards,
	Req,
	Get,
	HttpCode,
	Body,
	Param,
	UnauthorizedException,
	Redirect,
	Query,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { UserService } from '../user.service';
import { Response, request } from 'express';
import { User } from './../entities/user.entity';
//   import RequestWithUser from '../requestWithUser.interface';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly usersService: UserService,
	) { }
	@Get('generate/:userId/:email')
	async register(@Param('userId') userId: string, @Param('email') email: string) {
		const otpauthUrl = await
			this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(userId, email);
		const url = await this.twoFactorAuthenticationService.pipeQrCodeStream(otpauthUrl);
		return { url: url }
	}
	@Post('authenticate/:code/:id')
	@HttpCode(200)
	async authenticate(@Param('code') code: string, @Param('id') id: string, @Res() res: any,) {
		try {
			const user: User = await this.usersService.viewUser(id);
			const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				code,
				user,
			);
			if (!isCodeValid) {
				throw new BadRequestException('invalide code --> :');
			}
			await this.usersService.turnOnTwoFactorAuthentication(user.id);
			return res.redirect(process.env.FRONT_URL);
		} catch (error) {
			throw new UnauthorizedException(`hna fin kayn ${error}`);
		}
	}
}