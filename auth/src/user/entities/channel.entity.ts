import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Mute } from './mute.entity';
import { Msg } from './msg.entitiy';
import { forwardRef } from '@nestjs/common';

export enum ChannelTypes {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  // @Column({ default: 'uuid_generate_v4()', unique: true })
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

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.channels, { lazy: true })
  @JoinTable()
  owner: Promise<User>;

  // @ManyToMany(() => User, (user) => user.channels, { lazy: true })
  // @JoinTable()
  // members: Promise<User[]>;

  @ManyToMany(() => User, (user) => user.channels)
  users: User[];


}


