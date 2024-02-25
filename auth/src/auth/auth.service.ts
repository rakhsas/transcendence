import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt/dist";

@Injectable()


export class AuthService {

    constructor (
        private jwtService: JwtService
    ) {}

        async validateToken(token: string) {
            try {
                const payload = await this.jwtService.verifyAsync(token);
            } catch {
                throw new UnauthorizedException();
            }
            return true;
        }

    async generateAccessToken(user: any): Promise<string> {
        const payload = {
            id: user.id,
            username: user.username,
            provider: user.provider,
        }
        return await this.jwtService.signAsync(payload, {
            secret: process.env.JWTSECRET
        });
    }

    async decodeToken(request: any) {
        const { cookie } : any = request.headers;
        const authToken = this.getCookie('access_token', cookie);
        try {
            const authTokenPayload = await this.jwtService.verifyAsync(authToken, { secret: process.env.JWTSECRET });
            return authTokenPayload;
        } catch (error) {
            console.error('Error decoding token:', error);
            throw new Error('Invalid token'); // Adjust the error handling as needed
        }
    }
    
    
    getCookie( cookieName:string, cookies: string ): string {
        const array = cookies.split(";");
		for (let index = 0; index < array.length; index++) {
			const cookie = array[index].trim();
			if (cookie.startsWith(cookieName + '='))
			{
				return cookie.substring(cookieName.length + 1);
			}
		}
		return null;
	}
}