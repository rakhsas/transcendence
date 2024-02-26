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

import { User1 } from './user.entity'; // Import the User1 entity
import { Mute } from './mute.entity'; // Import the Mute entity
import { Msg } from './msg.entitiy'; // Import the Msg entity

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: () => 'uuid_generate_v4()', unique: true })
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

  @ManyToMany(() => User1, (user) => user.owner)
  @JoinTable()
  owners: User1[];

  @ManyToMany(() => User1, (user) => user.admin)
  @JoinTable()
  admins: User1[];

  @ManyToMany(() => User1, (user) => user.member)
  @JoinTable()
  members: User1[];

  @ManyToMany(() => User1, (user) => user.invited)
  @JoinTable()
  inviteds: User1[];

  @ManyToMany(() => User1, (user) => user.chanBlocked)
  @JoinTable()
  blocked: User1[];

  @OneToMany(() => Mute, (mute) => mute.channel)
  muted: Mute[];

  @OneToMany(() => Msg, (msg) => msg.channel)
  messages: Msg[];
}
