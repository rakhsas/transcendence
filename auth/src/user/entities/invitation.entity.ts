import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum InvitationStatus{
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINE = 'decline'
}


@Entity()
export class Invitation {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { eager: true })
    sender: User;
  
    @ManyToOne(() => User, { eager: true })
    recipient: User;
  
    @Column({ default: InvitationStatus.PENDING })
    status: InvitationStatus;
}
