import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Timestamp } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  player1: User;

  @ManyToOne(() => User)
  player2: User;
  

  @Column({ type: 'int' })
  user_scoore: number;

  @Column({ type: 'int' })
  player_scoore: number;

  // @Column()
  // winnerId: string

  @Column({type: 'int', nullable: true})
  TotalScoore: number

  @ManyToOne(() => User)
  winner: User;

  @Column({nullable: true})
  finishedAt: Date
}


/*
  how many match the user play,
  how many match win, 
  how many with max score, 5 - 0
  user - openent score winner 
*/