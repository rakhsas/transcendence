import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity'; // Import the User1 entity

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, user => user.friends)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User, (user) => user.friendOf) // Inverted relationship (optional)
  friendOf: User[]; // Array of User objects representing users who befriended this user
}
