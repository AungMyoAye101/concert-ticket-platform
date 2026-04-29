import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    concertId!: number;

    @Column()
    userId!: number;

    @Column()
    status!: string;

    @Column()
    expiresAt!: string;
}