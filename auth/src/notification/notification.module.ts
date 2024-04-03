import { Module } from "@nestjs/common";
import { Repository } from "typeorm";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notif } from "src/user/entities/notification.entity";
import { NotificationController } from "./notification.controller";
import { UserModule } from "src/user/user.module";
import { AuthModule } from "src/auth/auth.module";
import { HttpModule, HttpService } from "@nestjs/axios";
import { Channel } from "src/user/entities/channel.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Notif, Channel]),
        UserModule,
        AuthModule,
        HttpModule
    ],
    controllers: [NotificationController],
    providers: [Repository, NotificationService]
})

export class NotificationModule {}