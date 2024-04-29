import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Channel } from "./channel.entity";



@Entity()
export class Banned {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, {nullable: false})
    // @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Channel, {nullable: false})
    // @JoinColumn({ name: 'channel_id' })
    channel: Channel;
  
    @Column({default: "No reason provided"})
    reason: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    BannedAt: Date;
}