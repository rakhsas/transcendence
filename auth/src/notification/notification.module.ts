import { Module } from "@nestjs/common";
import { Repository } from "typeorm";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification])
    ],
    controllers: [],
    providers: [Repository, NotificationService]
})

export class NotificationModule {}