import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { UserGuard } from '../guards/user.guard';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Mute } from './entities/mute.entity';
import { Channel } from './entities/channel.entity';
import { Msg } from './entities/msg.entitiy';
import { Friendship } from './entities/freindship.entity';
import { MessageService } from '../msg/message.service';
import { MessageController } from '../msg/message.controller';
import { Notif } from './entities/notification.entity';
import { TwoFactorAuthenticationService } from './2FA/twoFactorAuthentication.service';
import { TwoFactorAuthenticationController } from './2FA/twoFactorAuthentication.controller';
import { UploadModule } from 'src/upload/upload.module';
import { UploadController } from 'src/upload/upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Msg, Channel, Mute, Friendship, Notif]),
    HttpModule,
    UploadModule
  ],
  providers: [UserService, UserGuard, AuthService, Repository, MessageService, TwoFactorAuthenticationService],
  controllers: [UserController, MessageController, TwoFactorAuthenticationController],
  exports: [UserService, MessageService],
})
export class UserModule {}
