import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/user/entities/game.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserGuard } from 'src/guards/user.guard';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, User]),
    HttpModule,
    // ChannelModule
  ],
  providers: [AnalyticsService, Repository, UserGuard, AuthService],
  // providers: [ChatService, ChatGateway, Repository, MsgController, MsgRepository, UserRepository],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
