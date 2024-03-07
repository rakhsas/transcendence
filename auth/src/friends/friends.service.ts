import { User } from 'src/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Friendship } from 'src/user/entities/freindship.entity';
import { Any, Repository } from 'typeorm';
@Injectable()

export class FriendService {
    constructor(
        @InjectRepository(Friendship)
        private readonly friendRepository: Repository<User>
    ) {}

    async getFriends(userId: UUID): Promise<User[]>
    {
        return await this.friendRepository
        .createQueryBuilder('friendship')
        .leftJoinAndSelect('friendship.friends', 'user')
        .where('user.id = :userId', { userId })
        .getMany();
    }
}