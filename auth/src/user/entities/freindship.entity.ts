import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity'; // Import the User1 entity

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.friends, {lazy: true})
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @ManyToOne(() => User, {lazy: true})
  @JoinColumn({ name: 'friend_id' })
  friend: Promise<User>;

  // @Column({ default: false })
  // accepted: boolean;
}
