
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

  // @CreateDateColumn()
  // createdAt: Date;

  
  // updatedAt: Date;
  
  @ManyToOne(() => User, (user) => user.sendmessages, {lazy: true})
  @JoinColumn({ name: 'senderId' })
  owner: Promise<User>;
  
  @Column()
  senderId: string;
  
  @ManyToOne(() => User, (user) => user.receivedMessages, {lazy: true})
  @JoinColumn({ name: 'recieverId' })
  receiver: Promise<User>;
  
  
  @ManyToOne(() => Channel, (channel) => channel.messages, {lazy: true})
  @JoinColumn({ name: 'cid' })
  channel: Promise<Channel>;
  
  @Column({ nullable: true })
  cid: number;

  @UpdateDateColumn()
  date: string;
  
  @Column({nullable: true})
  recieverId: string;

  @Column({ nullable: true })
  img: string;

  // @Column({ nullable: true })
  // profile: string;

  // @Column({ nullable: true })
  // username: string;

  // @Column({ nullable: true })
  // recieverUserName: string;


}
