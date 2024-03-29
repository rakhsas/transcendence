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
import { Game } from './game.entity';

@Entity('users') // Table name mapping
@Unique(['id', 'email', 'providerId', 'username'])
export class User {

  @PrimaryGeneratedColumn('uuid', { name: 'id', comment: 'User ID' })
  id: string;

  @Column()
  providerId: string;

  // @Column()
  // totalScore: number;
  
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

  @Column({nullable: false})
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

  @Column('uuid', { array: true, default: [] })
  added: string[];

  @Column('uuid', { array: true, default: [] })
  blocks: string[];
  
  @OneToMany(() => Mute, (mute) => mute.userId, { lazy: true, cascade: true  })
  Muted: Promise<Mute[]>;

  @OneToMany(() => Msg, (msg) => msg.senderId, { lazy: true, cascade: true  })
  sendmessages: Promise<Msg[]>;

  @OneToMany(() => Msg, (msg) => msg.reciever, { lazy: true, cascade: true  })
  receivedMessages: Promise<Msg[]>;


  @OneToMany(() => Friendship, friend => friend.user, {lazy: true, cascade: true })
  friends: Promise<Friendship[]>;

  @OneToMany(() => Friendship, friend => friend.friend, { lazy: true, cascade: true })
  friendOf: Promise<Friendship[]>;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;
     
  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;
  // ======================

  // @ManyToMany(() => Channel, (channel) => channel.members)
  // @JoinTable()
  // channels: Channel[];

  @ManyToMany(() => Channel)
  @JoinTable({ name: 'user_channels' }) // Specify the name for the join table
  channels: Channel[];

  @ManyToMany(() => Game, (game) => game.players)
  games: Game[]; // Array of games the player is involved in

  @BeforeInsert()
  generateUUID() {
    this.id = uuidv4();
  }
}