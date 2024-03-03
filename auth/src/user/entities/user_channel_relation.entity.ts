import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne,  } from "typeorm";
import { User } from "./user.entity";
import { Channel } from "./channel.entity";


@Entity('user_channel_relationships')
export class UserChannelRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @Column()
  role: string; // Admin, Member, Invited, Blocked, etc.
}


export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  OWNER = 'owner',
  INVITED = 'invited',
  BLOCKED = 'blocked',
}