import { Module } from "@nestjs/common";
import { friendController } from "./friends.controller";
import { FriendService } from "./friends.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friendship } from "src/user/entities/freindship.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { HttpModule, HttpService } from "@nestjs/axios";
import { UserModule } from "src/user/user.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship, User]),
    HttpModule,
    UserModule
  ],
    providers: [FriendService, Repository, FriendService, UserService],
    controllers: [friendController],
  })
  export class FreindsModule {}