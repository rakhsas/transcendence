import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';


@Entity()
export class Blocked {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.blockedUsers, {lazy: true})
    user: Promise<User>;
  
    @ManyToOne(() => User, {lazy: true})
    blockedUser: Promise<User>;
}
