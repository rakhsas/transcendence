import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable, BeforeInsert } from 'typeorm';
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

  // @PrimaryGeneratedColumn()
  // id: number;

  // @ManyToMany(() => User, user => user.friends)
  // @JoinTable()
  // friends: User[]; // friends of a user

  //@ManyToMany(() => User, (user) => user.friendOf) // Inverted relationship (optional)
  //friendOf: User[]; // user who consider user as friend
}
