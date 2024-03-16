import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './../auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class CustomAuthStrategy extends PassportStrategy(Strategy, 'custom') {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(req: Request): Promise<any> {
        const token = this.extractTokenFromRequest(req);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        const user = await this.authService.validateToken(token);
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }
        return user;
    }

    private extractTokenFromRequest(req: Request): string {
        const header = req.headers['authorization'];
        return header?.split(' ')[1];
    }
}

// auth.guard.ts
// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class CustomAuthGuard extends AuthGuard('custom') {}
