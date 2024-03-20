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

  @ManyToOne(() => User, (user) => user.channels, {lazy: true})
  user: Promise<User>;

  @ManyToOne(() => Channel, (channel) => channel.members, {lazy: true})
  channel: Promise<Channel>;

  @Column()
  role: UserRole;
}