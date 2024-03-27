import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  player1: User;

  @ManyToOne(() => User, { eager: true })
  player2: User;

  @Column({ type: 'int' })
  player1Score: number;

  @Column({ type: 'int' })
  player2Score: number;
}
