import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { channel } from "diagnostics_channel";
import { Channel } from "src/user/entities/channel.entity";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, User]),
    ],
    controllers: [ChannelController],
    providers: [ChannelService, Repository]
})
export class ChannelModule {}