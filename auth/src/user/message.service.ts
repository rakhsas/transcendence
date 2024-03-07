import { Injectable } from "@nestjs/common";
import { Msg } from "./entities/msg.entitiy";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";

@Injectable()

export class MessageService {
    constructor(
        @InjectRepository(Msg) private readonly messageRepository: Repository<Msg>,
		// private readonly http: HttpService,
    ) {}

    async latestMessages(): Promise<Msg[]> {
        return await this.messageRepository.find({
            relations: ['owner', 'receiver', 'channel'],
        });
    }

    async getMessages(senderId: string, recieverId: string): Promise<Msg[]> {
        return await this.messageRepository.find({
            where: [
                { senderId: senderId, recieverId: recieverId },
                { senderId: recieverId, recieverId: senderId}
            ],
            // relations: ['owner', 'receiver', 'channel'],
        });
    }

    async getLastMessagesOfUsers(): Promise<Msg[]> {
        return this.messageRepository
        .createQueryBuilder('msg')
        .select('DISTINCT ON (msg.owner, msg.receiver) msg.*')
        .orderBy('msg.owner, msg.receiver, msg.date', 'DESC')
        .getMany();
    }
}
