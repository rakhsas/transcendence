import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt/dist";
import { User } from "src/user/entities/user";

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

    async generateAccessToken(user: User): Promise<string> {
        const payload = {
            id: user.id,
            username: user.username,
            provider: user.provider,
        }
        return await this.jwtService.signAsync(payload, {
            secret: process.env.JWTSECRET
        });
    }
}