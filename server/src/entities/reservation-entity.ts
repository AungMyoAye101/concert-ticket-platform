import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket-entity";


export enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "COMPLETED",
    CANCELLED = "EXPIRED",
    COMPLETED = "COMPLETED"
}
@Entity()
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    concertId!: string;

    @Column({ type: "uuid" })
    userId!: string;

    @Column({
        type: "text",
        enum: ReservationStatus,
        default: ReservationStatus.PENDING
    })
    status!: ReservationStatus;

    @Column({ type: "datetime" })
    expiresAt!: Date;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // relations 

    @ManyToOne(() => Ticket, { onDelete: "CASCADE" })
    ticket!: Ticket;
}