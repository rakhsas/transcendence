import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { Notif } from "src/user/entities/notification.entity";
import { CreateNotifDto } from "./CreateNotifDto";
import { UserGuard } from "src/guards/user.guard";

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) {}

    @Get(':userId')
    @UseGuards(UserGuard)
    @ApiParam({ name: 'userId', type: String, format: 'uuid'})
    async getNotifications(@Param('userId')userId: string) {
        return this.notificationService.getNotificationsByTargetId(userId);
    }
    
    @Post(':userId')
    @ApiBody({ type: Notif })
    @UseGuards(UserGuard)
    async createNotification(@Body() notif: CreateNotifDto) {
        return this.notificationService.createNotification(notif);
    }

    @Get('single/:id')
    // @UseGuards(UserGuard)
    @ApiParam({ name: 'id', type: Number })
    async getNotificationById(@Param('id')id: number): Promise<Notif> {
        return await this.notificationService.getNotificationById(id);
    }
}