import { Injectable } from "@nestjs/common";
import { Msg } from "../user/entities/msg.entitiy";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { Friendship } from "../user/entities/freindship.entity";
import { User } from "../user/model/user.model";

@Injectable()

export class MessageService {
    constructor(
        @InjectRepository(Msg) private readonly messageRepository: Repository<Msg>,
        @InjectRepository(Friendship) private readonly friendShipRepository: Repository<Friendship>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        // private readonly http: HttpService,
    ) { }

    async latestMessages(): Promise<Msg[]> {
        return await this.messageRepository.find({
            relations: ['owner', 'reciever', 'channel'],
        });
    }

    async getMessages(senderId: string, recieverId: string): Promise<Msg[]> {
        return await this.messageRepository.find({
            where: [
                { senderId: senderId, recieverId: recieverId },
                { senderId: recieverId, recieverId: senderId }
            ],
            relations: ['owner', 'reciever', 'channel'],
        });
    }
    
     async getLastMessagesOfUsers(userid: string): Promise<Msg[]> {
        const friendships = await this.friendShipRepository.find({ where: [
            { user: { id: userid }},
            { friend: {id: userid }}
        ], relations: ['friend'] });
        const lastMessagesPromises = friendships.map(async (friendship) => {
            const friend = await friendship.friend;
            const user = await friendship.user;
            const lastMessage = await this.messageRepository.findOne({
                where: [
                    { senderId: user.id, recieverId: friend.id },
                    { senderId: friend.id, recieverId: user.id}
                ],
                order: { date: 'DESC' },
                relations: ['owner', 'reciever', 'channel']
            });
            return lastMessage;
        });
    
        return Promise.all(lastMessagesPromises);
    }

    // async getMessages(userId: string, friendId: string): Promise<Msg[]> {

    // }
}
