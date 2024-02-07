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
            const { authorization }: any = request.headers;
            if ( !authorization || authorization.trim() === '') {
                throw new UnauthorizedException('Please provide a token');
            }
            const authToken = authorization.replace('Bearer ', '').trim();
            const response = await this.authService.validateToken(authToken);
            request.decodedData = response;
            return true;
        } catch ( error ) {
            console.log( 'user error - ', error.message );
            throw new ForbiddenException(error.message || 'session expired! Please Sign In');
        }
    }
}