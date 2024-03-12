import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne,  } from "typeorm";
import { User } from "./user.entity";
import { Channel } from "./channel.entity";

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  OWNER = 'owner',
  INVITED = 'invited',
  BLOCKED = 'blocked',
}

// @Entity()
// export class ChannelMembership {
//   @PrimaryGeneratedColumn()
//   id: number;

  // @ManyToOne(() => User, user => user.channelMemberships, { eager: true , lazy: true})
  // user: Promise<User>;

  // @ManyToOne(() => Channel, channel => channel.channelMemberships, { eager: true, lazy: true})
  // channel: Promise<Channel>;

  // @Column({ type: 'enum', enum: ['admin', 'member', 'owner'], default: 'member' })
  // role: 'admin' | 'member' | 'owner';

  // @ManyToOne(() => User, user => user.channelMemberships)
  // user: User;

  // @ManyToOne(() => Channel, channel => channel.channelMemberships)
  // channel: Channel;

  // @Column({ type: 'enum', enum: ['admin', 'member', 'owner'], default: 'member' })
  // role: 'admin' | 'member' | 'owner';

// }


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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER, // Set a default role if needed
  })
  role: UserRole;

  @Column({default: false})
  isAllowed: boolean // true if the user allowed to send message false if not.
}


