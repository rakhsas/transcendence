import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

enum NotificationType {
    MESSAGE = 'MESSAGE',
    FRIEND_REQUEST = 'FRIEND_REQUEST',
    CALL_REQUEST = 'CALL_REQUEST',
}

@Entity()
export class Notif {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    target: User;
  
    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;
  
    @ManyToOne(() => User, { nullable: true })
    issuer: User;
  
    @Column()
    message: string;
  
    @Column({ default: false })
    seen: boolean;
  
    @Column({ default: false })
    read: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}
