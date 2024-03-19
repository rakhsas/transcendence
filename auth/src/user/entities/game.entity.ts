
import { Entity, ManyToMany, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => User, (player) => player.games)
    // player1: User;

    // @ManyToOne(() => User, (player) => player.games)
    // player2: User;
    
    @Column()
    winnerId: string

    @Column()
    scoreOfPlayer1: number

    @Column()
    scoreOfPlayer2: number

    @ManyToMany(() => User, (player) => player.games)
    players: User[]; // Array of players involved in the game
}
