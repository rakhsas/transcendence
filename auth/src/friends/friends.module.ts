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
import { UserGuard } from "src/guards/user.guard";
import { AuthModule } from "src/auth/auth.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship, User]),
    HttpModule,
    UserModule,
    AuthModule
  ],
    providers: [FriendService, Repository, FriendService, UserService, UserGuard],
    controllers: [friendController],
  })
  export class FreindsModule {}