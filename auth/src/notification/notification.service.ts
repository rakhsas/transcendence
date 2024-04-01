import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notif } from "src/user/entities/notification.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotificationService {
    /**
     *
     */
    constructor(
        @InjectRepository(Notif) private notificationRepository: Repository<Notif>
    ) {
        
    }
}
