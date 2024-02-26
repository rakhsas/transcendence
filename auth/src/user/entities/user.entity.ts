import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Channel } from './Channel'; // Assuming you have a Channel entity
import { Mute } from './Mute'; // Assuming you have a Mute entity
import { Msg } from './Msg'; // Assuming you have a Msg entity
import { Friendship } from './freindship.entity'; // Assuming you have a Friendship entity

@Entity('users') // Table name mapping
@Unique(['id', 'email'])
export class User1 {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  picture: string;

  @Column()
  coalition: string;

  @Column()
  coalitionPic: string;

  @Column()
  coalitionCover: string;

  @Column()
  coalitionColor: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  username: string;

  // friends     Int[]
  @Column('int', { array: true, default: [] })
  adding: number[];

  @Column('int', { array: true, default: [] })
  added: number[];

  @Column('int', { array: true, default: [] })
  blocks: number[];

  @Column('int', { array: true, default: [] })
  blocking: number[];

  // blocked     Int[] // ...

  @OneToMany(() => Channel, (channel) => channel.owner)
  owner: Channel[];

  @ManyToMany(() => Channel, (channel) => channel.admin)
  @JoinTable()
  admin: Channel[];

  @ManyToMany(() => Channel, (channel) => channel.member)
  @JoinTable()
  member: Channel[];

  @ManyToMany(() => Channel, (channel) => channel.invited)
  @JoinTable()
  invited: Channel[];

  @ManyToMany(() => Channel, (channel) => channel.chanBlocked)
  @JoinTable()
  chanBlocked: Channel[];

  @OneToMany(() => Mute, (mute) => mute.user)
  Muted: Mute[];

  @OneToMany(() => Msg, (msg) => msg.sender)
  sendmessages: Msg[];

  @OneToMany(() => Msg, (msg) => msg.receiver)
  receivedMessages: Msg[];

  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friendsUser: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend)
  userFriends: Friendship[];
}
