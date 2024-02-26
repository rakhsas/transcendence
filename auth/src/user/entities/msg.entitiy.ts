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

  @ManyToOne(() => User1, (user) => user.sendmessages)
  @JoinColumn({ name: 'senderId' })
  owner: User1;

  @Column()
  senderId: number;

  @ManyToOne(() => User1, (user) => user.receivedMessages)
  @JoinColumn({ name: 'rec_id' })
  receiver: User1;

  @Column()
  rec_id: number;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  @JoinColumn({ name: 'cid' })
  channel: Channel;

  @Column({ nullable: true })
  cid: number;
}
