import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    concertId!: string;

    @Column({ type: "uuid" })
    userId!: string;

    @Column({ type: "varchar" })
    status!: string;

    @Column({ type: "datetime" })
    expiresAt!: Date;
}