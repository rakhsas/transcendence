import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { UserGuard } from './user.guard';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    // TypeOrmModule.forFeature([User]),
    HttpModule,
  ],
  providers: [UserService, UserGuard, AuthService, PrismaService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
