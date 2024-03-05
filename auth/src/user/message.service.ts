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
        return await this.messageRepository.find();
    }
}