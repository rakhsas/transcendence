import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service';

@Injectable()

export class UserGuard implements CanActivate {
    /**
     *
     */
    constructor(
        private readonly authService: AuthService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const { cookie } : any = request.headers;
            const authToken = this.getCookie('access_token', cookie);
            if ( authToken === null || !authToken) {
                throw new UnauthorizedException('Please provide a token');
            }
            const response = await this.authService.validateToken(authToken);
            request.decodedData = response;
            return true;
        } catch ( error ) {
            console.log( 'user error - ', error.message );
            throw new ForbiddenException(error.message || 'session expired! Please Sign In');
        }
    }

    getCookie( cookieName:string, cookies: string ): string {
        const array = cookies.split(";");

        // console.log("length: ", array.length)
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