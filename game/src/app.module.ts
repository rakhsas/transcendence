import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GameGetwayModule } from './game-getway/game-getway.module';

@Module({
  imports: [
    HttpModule,
   GameGetwayModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
