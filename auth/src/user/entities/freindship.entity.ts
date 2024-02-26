import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { User1 } from './user.entity'; // Import the User1 entity

@Entity()
export class Friendship {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  freindId: number;

  @ManyToOne(() => User1, (user) => user.friendsUser)
  user: User1;

  @ManyToOne(() => User1, (user) => user.userFriends)
  friend: User1;
}
