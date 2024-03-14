
import { User } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Friendship } from 'src/user/entities/freindship.entity';
import { Any, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
@Injectable()

export class FriendService {
    constructor(
        @InjectRepository(Friendship) private readonly friendRepository: Repository<Friendship>,
        @InjectRepository(User) private readonly  userRepository: Repository<User>,
        // private readonly userService: UserService
    ) {}


    async getFriends(userId: string): Promise<User[]>
    {
      const friendships = await this.friendRepository.find({
        where: [{ user: { id: userId } }],
        relations: ['user', 'friend'], // Load related User entities
      });
  
      // Extract all unique friends from the friendships
      const friends = friendships.map(async friendship => {
        return (await friendship.user).id !== userId ? friendship.user : friendship.friend;
      });
      return Promise.all(friends); // Wait for all promises to resolve
    }


    async createFriendship(userId: string, friendId: string): Promise<Friendship[]> {
      
        // const { userId, friendId } = createFriendshipDto;

        const user = await this.userRepository.findOne({where: {id: userId}});
        const friend = await this.userRepository.findOne({where: {id: friendId}});

        const friendship1 = new Friendship();

        friendship1.user = Promise.resolve(user);
        friendship1.friend = Promise.resolve(friend);

        const friendship2 = new Friendship();

        friendship2.user = Promise.resolve(friend);
        friendship2.friend = Promise.resolve(user);

        return this.friendRepository.save([friendship1 ,friendship2]);
    } 


}