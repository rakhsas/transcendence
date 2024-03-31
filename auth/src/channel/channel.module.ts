import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/user/entities/channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ChannelUser } from 'src/user/entities/channel_member.entity';
import { Msg } from 'src/user/entities/msg.entitiy';
import { AuthModule } from 'src/auth/auth.module';
import { UserGuard } from 'src/guards/user.guard';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User, ChannelUser, Msg]),
    AuthModule,
    HttpModule,
    UserModule
  ],
  controllers: [ChannelController],
  providers: [ChannelService, Repository, UserGuard],
})
export class ChannelModule {}
