import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "src/user/entities/notification.entity";

export class CreateNotifDto {
    @ApiProperty()
    target: string;
    
    @ApiProperty()
    type: NotificationType;

    @ApiProperty()
    issuer: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    audio: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    channel: string;
}