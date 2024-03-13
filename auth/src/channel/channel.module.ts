import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "src/user/entities/channel.entity";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { ChannelUser } from "src/user/entities/channel_member.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, User, ChannelUser]),
    ],
    controllers: [ChannelController],
    providers: [ChannelService, Repository]
})
export class ChannelModule {}