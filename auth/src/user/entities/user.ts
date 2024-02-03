import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity()

export class User {

    @PrimaryColumn()
    // @Column({ type: 'varchar', length: 45 })
    id: string;

    @Column({ type: 'varchar', length: 45 })
    email: string;

    @Column({ type: 'varchar', length: 25 })
    username: string;

    @Column({ type: 'varchar', length: 45 })
    firstName: string;
    
    @Column({ type: 'varchar', length: 45 })
    lastName: string;
    
    @Column({ type: 'varchar', length: 45 })
    provider: string;
    
    @Column({ type: 'varchar', length: 255 })
    picture: string;
    // @Column({ type: 'varchar' })
    // accessToken: string;

//     @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
//     /**
//      * m - male
//      * f - female
//      * u - unspecified
//     */
//     gender: string;
}

// provider: '42',
//   id: '95248',
//   email: 'rakhsas@student.1337.ma',
//   firstName: 'Akhsas',
//   lastName: 'Rida',
//   username: 'Rida Akhsas',
//   picture: