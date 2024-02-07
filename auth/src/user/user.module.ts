import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Repository } from 'typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserGuard } from './user.guard';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
  ],
  providers: [UserService, UserGuard, AuthService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
