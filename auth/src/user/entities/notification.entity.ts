import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Channel } from "./channel.entity";
import { join } from "path";


export enum NotificationType {
    MESSAGE = 'MESSAGE',
    FRIEND_REQUEST = 'FRIEND_REQUEST',
    CALL_REQUEST = 'CALL_REQUEST',
    CHANNEL_MESSAGE = 'CHANNEL_MESSAGE',
    CHANNEL_INVITE = 'CHANNEL_INVITE',
    FRIEND_REQUEST_ACCEPTED= 'FRIEND_REQUEST_ACCEPTED',
}

@Entity()
export class Notif {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { nullable: true })
    target: User;
  
    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;
  
    @ManyToOne(() => User, { nullable: true })
    issuer: User;
  
    @Column({ nullable: true})
    message: string;

    @ManyToOne(() => Channel, { nullable: true })
    channel: Channel;
    
    @Column({ nullable: true})
    audio: string;

    @Column({ nullable: true})
    image: string;
  
    @Column({ default: false })
    seen: boolean;
  
    @Column({ default: false })
    read: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}
