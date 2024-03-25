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
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { UserService } from '../user.service';
import { Response, request } from 'express';
import { User } from './../entities/user.entity';
//   import RequestWithUser from '../requestWithUser.interface';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  // usersService: any;
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UserService,
  ) { }
  @Get('generate/:userId/:email')
  // @UseGuards(UserGuard)
  async register(@Param('userId') userId: string, @Param('email') email: string) {
    const otpauthUrl = await
      this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(userId, email);
    const url = await this.twoFactorAuthenticationService.pipeQrCodeStream(otpauthUrl);
    return { url: url }
  }
  @Get('authenticate/:code/:id')
  // @UseGuards(UserGuard)
  // @HttpCode(200)
  async authenticate(
    @Param('code') code: string,
    @Param('id') id: string,
    @Res() res: any,
  ) {
    // try {
      const user: User = await this.usersService.viewUser(id);
      const isCodeValid =  await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,
        user,
      );
      if (!isCodeValid) {
        res.redirect(`https://localhost/dashboard/settings?invalid`);
      }
      await this.usersService.turnOnTwoFactorAuthentication(user.id);
      res.redirect(`https://localhost/dashboard`);
    // } catch (error) {
    //   throw new UnauthorizedException('hna fin kayn');
    // }
  }

  /*
  @Post('authenticate/')
  @HttpCode(200)
  @Res()
  // @UseGuards(UseGuards)
  
  async authenticate( @Param('code') code: string, @Param('userId') userId: string, @Param('email') email: string, @Param ('user') user: User
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,  user
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication()
    return res.redirect(`http://http://localhost:4200/dashboard`);
  }
  */

}