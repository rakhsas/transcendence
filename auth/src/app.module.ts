import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Channel } from './user/entities/channel.entity';
import { Friendship } from './user/entities/freindship.entity';
import { Msg } from './user/entities/msg.entitiy';
import { Mute } from './user/entities/mute.entity';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { FreindsModule } from './friends/friends.module';
import { GameGetwayModule } from './game-getway/game-getway.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelUser } from './user/entities/channel_member.entity';
import { GameEntity } from './user/entities/game.entity';
import { UploadModule } from './upload/upload.module';
import express from 'express';
import { join } from 'path';
import { NotificationModule } from './notification/notification.module';
import { Blocked } from './user/entities/blocked.entity';
import { Banned } from './user/entities/ban.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'db1',
      synchronize: true,
      entities: [User, Msg, GameEntity, Channel, Mute, Friendship, ChannelUser, Blocked, Banned],
    }),
    UserModule,
    AuthModule,
    ChatModule,
    FreindsModule,
    GameGetwayModule,
    ChannelModule,
    UploadModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(join(__dirname, '..', 'uploads')))
      .forRoutes('upload');
  }
}
