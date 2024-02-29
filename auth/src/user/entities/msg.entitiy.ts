
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User1 } from './user.entity'; // Import the User1 entity
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

  @ManyToOne(() => User1, (user) => user.sendmessages, {lazy: true})
  @JoinColumn({ name: 'senderId' })
  owner: Promise<User1>;

  @Column()
  senderId: number;

  @ManyToOne(() => User1, (user) => user.receivedMessages, {lazy: true})
  @JoinColumn({ name: 'rec_id' })
  receiver: Promise<User1>;

  @Column()
  rec_id: number;

  @ManyToOne(() => Channel, (channel) => channel.messages, {lazy: true})
  @JoinColumn({ name: 'cid' })
  channel: Promise<Channel>;

  @Column({ nullable: true })
  cid: number;
}
