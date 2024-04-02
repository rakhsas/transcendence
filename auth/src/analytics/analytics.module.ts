import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    // ChannelModule
  ],
  providers: [],
  // providers: [ChatService, ChatGateway, Repository, MsgController, MsgRepository, UserRepository],
  controllers: [],
})
export class AnalyticsModule {}
