import { Module } from '@nestjs/common';
import { GameGetwayService } from './game-getway.service';
import { GameGetwayController } from './game-getway.controller';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/user/entities/game.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Game, User]),
    UserModule
  ],
  providers: [GameGetwayService, AuthService],
  controllers: [GameGetwayController]
})
export class GameGetwayModule {}
