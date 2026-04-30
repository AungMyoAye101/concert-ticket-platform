import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Ticket } from "./ticket-entity";


export enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "COMPLETED",
    CANCELLED = "EXPIRED"
}
@Entity()
@Index("idx_reservation_status", ["status"], { where: "status = PENDING" })
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