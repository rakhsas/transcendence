
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity'; // Import the User1 entity
import { Channel } from './channel.entity'; // Import the Channel entity




@Entity()
export class Msg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  msg: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sendmessages, {lazy: true})
  @JoinColumn({ name: 'senderId' })
  owner: Promise<User>;

  @Column()
  senderId: string;

  @ManyToOne(() => User, (user) => user.receivedMessages, {lazy: true})
  @JoinColumn({ name: 'rec_id' })
  receiver: Promise<User>;

  @Column({nullable: true})
  rec_id: string;

  @ManyToOne(() => Channel, (channel) => channel.messages, {lazy: true})
  @JoinColumn({ name: 'cid' })
  channel: Promise<Channel>;

  @Column({ nullable: true })
  cid: number;
}
