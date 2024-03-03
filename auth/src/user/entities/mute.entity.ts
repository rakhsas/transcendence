import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity'; // Import the User entity
import { Channel } from './channel.entity'; // Import the Channel entity

@Entity()
export class Mute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  finishAt: Date;

  @Column({ default: false })
  finished: boolean;

  @ManyToOne(() => User, (user) => user.Muted, {lazy: true})
  @JoinColumn({ name: 'userId' })
  muted: Promise<User>;

  @Column()
  userId: number;

  @ManyToOne(() => Channel, (channel) => channel.muted, {lazy: true})
  @JoinColumn({ name: 'cid' })
  channel: Promise<Channel>;

  @Column()
  cid: number;
}
