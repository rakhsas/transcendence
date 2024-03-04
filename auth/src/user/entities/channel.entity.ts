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
  dm: boolean;

  @Column({ default: false })
  private: boolean;

  @Column({ default: false })
  isPassword: boolean;

  @Column({ nullable: true })
  password: string;

  // @ManyToMany(() => User1, (user) => user.owner, { lazy: true })
  // @JoinTable()
  // owners: Promise<User1[]>;

  // @ManyToMany(() => User1, (user) => user.admin, { lazy: true })
  // @JoinTable()
  // admins: Promise<User1[]>;

  // @ManyToMany(() => User1, (user) => user.member, { lazy: true })
  // @JoinTable()
  // members: Promise<User1[]>;

  // @ManyToMany(() => User1, (user) => user.invited, { lazy: true })
  // @JoinTable()
  // inviteds: Promise<User1[]>;

  // @ManyToMany(() => User1, (user) => user.chanBlocked, { lazy: true })
  // @JoinTable()
  // blocked: Promise<User1[]>;

  @OneToMany(() => Mute, (mute) => mute.channel, { lazy: true })
  muted: Promise<Mute[]>;

  @OneToMany(() => Msg, (msg) => msg.channel, { lazy: true })
  messages: Promise<Msg[]>;
}
