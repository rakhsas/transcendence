import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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
  userScoore: number;

  @Column({ type: 'int' })
  playerScoore: number;

  // @Column()
  // winnerId: string

  @ManyToOne(() => User)
  winner: User;
}
