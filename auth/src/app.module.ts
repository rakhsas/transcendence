import { Module } from '@nestjs/common';
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
import { UserChannelRelationship } from './user/entities/user_channel_relation.entity';
import { ConfigModule } from '@nestjs/config';
import { FreindsModule } from './friends/friends.module';
import { MessageController } from './msg/message.controller';
import { MessageService } from './msg/message.service';
import { Repository } from 'typeorm';
import { GameGetwayModule } from './game-getway/game-getway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'db1',
      synchronize: true,
      // logging: true,
      entities: [User, Msg, Channel, Mute, Friendship, UserChannelRelationship],

    }),
    UserModule,
    AuthModule,
    ChatModule,
    FreindsModule,
    GameGetwayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
