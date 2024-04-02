import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notif } from "src/user/entities/notification.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateNotifDto } from "./CreateNotifDto";

@Injectable()
export class NotificationService {
    /**
     *
     */
    constructor(
        @InjectRepository(Notif) private notificationRepository: Repository<Notif>,
        private readonly userService: UserService
    ) {
    }

    async getNotificationsByTargetId(targetId: string): Promise<Notif[]> {
        return await this.notificationRepository.find({
          where: { target: { id: targetId } },
          relations: ['issuer'],
          order: { createdAt: 'DESC' }
        });
    }

    async createNotification(notif: CreateNotifDto) {
        return await this.notificationRepository.save(notif);
    }

    async getNotificationById(id: number): Promise<Notif> {
        return await this.notificationRepository.findOne({
            where: { id },
            relations: ['issuer', 'target']
        });
    }
}
