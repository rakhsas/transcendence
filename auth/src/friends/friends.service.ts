import { User } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Friendship } from 'src/user/entities/freindship.entity';
import { Any, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
@Injectable()

export class FriendService {
    constructor(
        @InjectRepository(Friendship) private readonly friendRepository: Repository<Friendship>,
        private readonly userService: UserService
    ) {}

    async getFriends(userId: string): Promise<User[]>
    {
        try {
            // const friendships = await this.friendRepository
            //   .createQueryBuilder('friendship')
            //   .leftJoinAndSelect('friendship.friend', 'friend')
            //   .where('friendship.user.id = :userId', { userId })
            //   .getMany();
            const friendships = await this.friendRepository
              .createQueryBuilder('friendship')
              .leftJoinAndSelect('friendship.user', 'user') // Join user entity
              .leftJoinAndSelect('friendship.friend', 'friend') // Join friend entity
              .where('user.id = :userId', { userId })
              .orWhere('friend.id = :userId', { userId }) // Also check friend ID
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

    // Assuming you have a method in your service for creating friendships
    async createFriendship(userId: string, friendId: string): Promise<Friendship> {
      const friendship = new Friendship();
      friendship.user = this.userService.viewUser(userId);
      friendship.friend = this.userService.viewUser(friendId);
    
      // Save the original friendship
      const savedFriendship = await this.friendRepository.save(friendship);
    
      // Create the reverse friendship
      const reverseFriendship = new Friendship();
      reverseFriendship.user = friendship.friend; // Swap user and friend
      reverseFriendship.friend = friendship.user;
    
      // Save the reverse friendship
      await this.friendRepository.save(reverseFriendship);
    
      return savedFriendship;
    }

}