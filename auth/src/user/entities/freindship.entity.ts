import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Import the User1 entity

@Entity()
export class Friendship {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  freindId: number;

  @ManyToOne(() => User, (user) => user.friendsUser, {lazy: true})
  user: Promise<User>;

  @ManyToOne(() => User, (user) => user.userFriends, {lazy: true})
  friend: Promise<User>;
}
