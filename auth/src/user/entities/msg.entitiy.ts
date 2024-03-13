
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
  message: string;
  
  @ManyToOne(() => User, (user) => user.sendmessages, {lazy: true})
  @JoinColumn({ name: 'senderId' })
  owner: Promise<User>;
  
  @Column()
  senderId: string;
  
  @ManyToOne(() => User, (user) => user.receivedMessages, {lazy: true})
  @JoinColumn({ name: 'recieverId' })
  reciever: Promise<User>;
  
  
  @ManyToOne(() => Channel, (channel) => channel.messages, {lazy: true})
  @JoinColumn({ name: 'cid' })
  channel: Promise<Channel>;
  
  @Column({ nullable: true })
  cid: number;

  @UpdateDateColumn()
  date: string;
  
  @Column({nullable: true})
  recieverId: string;

  @Column({ nullable: true})
  img: string;

}
