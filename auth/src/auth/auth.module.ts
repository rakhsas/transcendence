import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './utils/42-strategy';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { GithubStrategy } from './utils/GithubStrategy';
import { HttpService } from '@nestjs/axios';

// console.log('process.env:', process.env);
// console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET);

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: 'config/.env',
            isGlobal: true,
        }),
        PassportModule.register({ defaultStrategy: '42' }),
        UserModule,
        JwtModule.register({
            global: true,
            secret: 'fsdkfjdklsj345rklefjkldjsfksdkjfjdksfndsfnkds',
        })
    ],
    controllers: [AuthController],
    providers: [ AuthService, FortyTwoStrategy, GithubStrategy, JwtService],
    exports: [AuthService]
})
export class AuthModule {}
