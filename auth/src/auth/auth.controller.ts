import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    /**
     *
     */
    constructor(
        private readonly authService: AuthService
    ) {}

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
        const firstLogin = req.user.firstLogin;
        const accessToken = req.user.appAccessToken;
        const providerAccessToken = req.user.providerAccessToken;
        res.cookie('access_token', accessToken, { httpOnly: true});
        res.cookie('provider_access_token', providerAccessToken);
        res.cookie('isAuthenticated', true);
        res.cookie('firstLogin', firstLogin);
        // return {
        //     user,
        //     accessToken,
        //     providerAccessToken,
        //     firstLogin
        // }
        res.redirect(`https://127.0.0.1/dashboard`)
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
        const firstLogin = req.user.firstLogin;
        const accessToken = req.user.appAccessToken;
        const providerAccessToken = req.user.providerAccessToken;
        res.redirect(`http://localhost:4200/dashboard?firstLogin=${firstLogin}&accessToken=${accessToken}&provider=${providerAccessToken}`);
    }

    @Get('decodeToken')
    @UseGuards(UseGuards)
    async decodedToken(@Req() req) {
        return await this.authService.decodeToken(req);
    }
    
}