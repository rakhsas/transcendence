import { Module } from "@nestjs/common";
import { Repository } from "typeorm";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notif } from "src/user/entities/notification.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Notif])
    ],
    controllers: [],
    providers: [Repository, NotificationService]
})

export class NotificationModule {}