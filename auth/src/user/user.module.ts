import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Repository } from 'typeorm';
// import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
