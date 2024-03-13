import { Channel } from 'src/user/entities/channel.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    OWNER = 'OWNER',
  }

@Entity({ name: 'channel_user' })
export class ChannelUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.channels)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.members)
  channel: Channel;

  @Column()
  role: UserRole;
}