import { Module } from "@nestjs/common";
import { friendController } from "./friends.controller";
import { FriendService } from "./friends.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friendship } from "src/user/entities/freindship.entity";
import { User } from "src/user/entities/user.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friendship]),
  ],
    providers: [FriendService],
    controllers: [friendController],
  })
  export class FreindsModule {}