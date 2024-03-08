import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { User } from './user.entity'; // Import the User1 entity
import { Mute } from './mute.entity'; // Import the Mute entity
import { Msg } from './msg.entitiy'; // Import the Msg entity

export enum ChannelTypes {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'uuid_generate_v4()', unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  private: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: ChannelTypes,
    default: ChannelTypes.PUBLIC, // Set a default role if needed
  })
  type: ChannelTypes;

  @OneToMany(() => Mute, (mute) => mute.channel, { lazy: true })
  muted: Promise<Mute[]>;

  @OneToMany(() => Msg, (msg) => msg.channel, { lazy: true })
  messages: Promise<Msg[]>;
}


