import { User } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Friendship } from 'src/user/entities/freindship.entity';
import { Any, Repository } from 'typeorm';
@Injectable()

export class FriendService {
    constructor(
        @InjectRepository(Friendship)
        private readonly friendRepository: Repository<Friendship>
    ) {}

    async getFriends(userId: UUID): Promise<User[]>
    {
        try {
            const friendships = await this.friendRepository
              .createQueryBuilder('friendship')
              .leftJoinAndSelect('friendship.friend', 'friend')
              .where('friendship.user.id = :userId', { userId })
              .getMany();
      
            if (friendships.length === 0) {
              throw new NotFoundException(`User with ID ${userId} not found or has no friends`);
            }
      
            const friends: User[] = await Promise.all(friendships.map(friendship => friendship.friend));
      
            return friends;
          } catch (error) {
            if (error instanceof NotFoundException) {
              throw error;
            }
      
            // Handle other errors, log, or rethrow as needed
            throw error;
          }
    }
}