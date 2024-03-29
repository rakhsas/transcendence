import { Module } from '@nestjs/common';
import { GameGetwayService } from './game.service';
import { GameController } from './game.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/user/entities/game.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, User]),
    UserModule,
    ScheduleModule.forRoot(),
  ],
  // imports: [ScheduleModule.forRoot()],
  controllers: [GameController],
  providers: [GameGetwayService, AuthService],
})
export class GameGetwayModule {}
