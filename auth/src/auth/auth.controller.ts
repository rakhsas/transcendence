import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { FortyTwoStrategy } from "./utils/42-strategy";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {

    @Get('42/login')
    @UseGuards(AuthGuard('42'))
    handle42Login() {
        return {
            msg: '42 authentication'
        }
    }


    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async handle42Redirect(@Req() req, @Res() res) {
        const user = req.user;
        console.log("user :", user)
        const firstLogin = req.user.firstLogin;
        const accessToken = req.user.appAccessToken;
        const providerAccessToken = req.user.providerAccessToken;
        res.redirect(`http://localhost:4200/dashboard?firstLogin=${firstLogin}&accessToken=${accessToken}&provider=${providerAccessToken}`)
    }

    @Get('github/login')
    @UseGuards(AuthGuard('github'))
    handleGithubLogin() {
        return {
            msg: 'GitHub authentication',
        };
    }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    async handleGithubRedirect(@Req() req, @Res() res) {
        const user = req.user;
        console.log("user :", user);
        const firstLogin = req.user.firstLogin;
        const accessToken = req.user.appAccessToken;
        const providerAccessToken = req.user.providerAccessToken;
        res.redirect(`http://localhost:4200/dashboard?firstLogin=${firstLogin}&accessToken=${accessToken}&provider=${providerAccessToken}`);
    }

}