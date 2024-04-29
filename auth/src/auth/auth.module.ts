import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './utils/42-strategy';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalGateway } from './global.gateway';
import { UploadModule } from 'src/upload/upload.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: 'config/.env',
            isGlobal: true,
        }),
        PassportModule.register({ defaultStrategy: '42' }),
        UserModule,
        UploadModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWTSECRET,
            signOptions: { expiresIn: '30m' }
        }),
        HttpModule
    ],
    controllers: [AuthController],
    providers: [ AuthService, FortyTwoStrategy, JwtService, GlobalGateway],
    exports: [AuthService]
})
export class AuthModule {}
