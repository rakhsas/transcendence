import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt/dist";
import { User } from "src/user/entities/user";

@Injectable()


export class AuthService {
    private readonly jwtSecret: string = 'jfdhsfjksdfdksf'

    constructor (
        private jwtService: JwtService
    ) {}
    async generateAccessToken(user: User): Promise<string> {
        const payload = {
            id: user.id,
            username: user.username,
            provider: user.provider
        }

        const expiresIn = 300;
        return await this.jwtService.signAsync(payload, {
            expiresIn: expiresIn,
            secret: this.jwtSecret
        });
    }
}