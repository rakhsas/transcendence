import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {
  // }
  // @Get('github')
  // @UseGuards(AuthGuard('github'))
  // async githubAuth(@Req() req) {
  // }
  
  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req, @Res() res) {
  //   const user = await this.appService.googleLogin(req);
  //   return res.redirect('http://localhost:4200/login');
  // }
  // @Get('github/callback')
  // @UseGuards(AuthGuard('github'))
  // async githubAuthRedirect(@Req() req, @Res() res) {
  //   const user = await this.appService.githubLogin(req);
  //   return res.redirect('http://localhost:4200/login');
  // }
    @Get()
    @UseGuards(AuthGuard('42'))
    getHello(): string {
      return this.appService.hello();
    }

    @Get("getHello")
    getHelo(): string {
      return "RIIIIIIDOOX"
    }

}
