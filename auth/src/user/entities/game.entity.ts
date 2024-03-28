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
  player1Score: number;

  @Column({ type: 'int' })
  player2Score: number;
}
