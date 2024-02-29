import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module'; 
import { UserController } from './user/user.controller';
import { AuthService } from './auth/auth.service';
// import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { Msg } from './user/entities/msg.entitiy';
import { User1 } from './user/entities/user.entity';
import { Channel } from './user/entities/channel.entity';
import { Mute } from './user/entities/mute.entity';
import { Friendship } from './user/entities/freindship.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // or 'postgres', 'mysql', 'mariadb', 'sqlite', 'oracle', 'mssql'
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'db1',
      synchronize: true, // Set to true for development, but not recommended for production
      logging: true, // Enable to see SQL logs
      entities: [Msg, User1, Channel, Mute, Friendship], // Specify the entities (models) you want to include in the database
    }),
    // ConfigModule.forRoot({
    //   envFilePath: 'config/.env',
    //   isGlobal: true,
    // }),
    UserModule,
    AuthModule,
    PrismaModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
