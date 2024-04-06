import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

import { User } from './user.entity'; // Import the User entity
import { Channel } from './channel.entity'; // Import the Channel entity

@Entity()
export class Mute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column()
  finishedAt: Date;

  @Column({ default: false })
  finished: boolean;

  @BeforeInsert()
  setFinishedAt() {
    const now = new Date();
    //console.log(now);
    now.setMinutes(now.getMinutes() + 1);
    this.finishedAt = now;
    // //console.log(this.finishedAt);
  }

  @ManyToOne(() => User, (user) => user.Muted, {lazy: true})
  @JoinColumn({ name: 'userId' })
  muted: Promise<User>;

  @Column()
  userId: string;

  @ManyToOne(() => Channel, (channel) => channel.muted, {lazy: true})
  @JoinColumn({ name: 'cid' })
  channel: Promise<Channel>;

  @Column()
  cid: number;
}
