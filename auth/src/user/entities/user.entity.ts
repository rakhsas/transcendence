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
  BeforeInsert,
} from 'typeorm';

import { Channel } from './channel.entity'; // Assuming you have a Channel entity
import { Friendship } from './freindship.entity'; // Assuming you have a Friendship entity
import { Msg } from './msg.entitiy'; // Assuming you have a Msg entity
import { Mute } from './mute.entity'; // Assuming you have a Mute entity
import { v4 as uuidv4 } from 'uuid'

@Entity('users') // Table name mapping
@Unique(['id', 'email', 'providerId', 'username'])
export class User {

  @PrimaryGeneratedColumn('uuid', { name: 'id', comment: 'User ID' })
  id: string;

  @Column()
  providerId: string;


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
  provider: string;

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

  @Column({ nullable: false, unique: true })
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

  // @OneToMany(() => Channel, (channel) => channel.owners, { lazy: true })
  // owner: Promise<Channel[]>;

  // @ManyToMany(() => Channel, (channel) => channel.admins, { lazy: true })
  // @JoinTable()
  // admin: Promise<Channel[]>;

  // @ManyToMany(() => Channel, (channel) => channel.members, { lazy: true })
  // @JoinTable()
  // member: Promise<Channel[]>;

  // @ManyToMany(() => Channel, (channel) => channel.inviteds, { lazy: true })
  // @JoinTable()
  // invited: Promise<Channel[]>;

  // @ManyToMany(() => Channel, (channel) => channel.blocked, { lazy: true })
  // @JoinTable()
  // chanBlocked: Promise<Channel[]>;

  
  @OneToMany(() => Mute, (mute) => mute.userId, { lazy: true })
  Muted: Promise<Mute[]>;

  @OneToMany(() => Msg, (msg) => msg.senderId, { lazy: true })
  sendmessages: Promise<Msg[]>;

  @OneToMany(() => Msg, (msg) => msg.receiver, { lazy: true })
  receivedMessages: Promise<Msg[]>;

  @OneToMany(() => Friendship, (friendship) => friendship.user, { lazy: true })
  friendsUser: Promise<Friendship[]>;

  @OneToMany(() => Friendship, (friendship) => friendship.friend, { lazy: true })
  userFriends: Promise<Friendship[]>;

  @BeforeInsert()
  generateUUID() {
    this.id = uuidv4();
  }
}
