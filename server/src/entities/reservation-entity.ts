import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn } from "typeorm";
import { Ticket } from "./ticket-entity";
import { Concert } from "./concert-entity";
import { User } from "./user-entity";


export enum ReservationStatus {
    PENDING = "PENDING",
    EXPIRED = "EXPIRED",
    COMPLETED = "COMPLETED",
}

@Entity()
@Index("idx_reservation_pending_expires", ["expiresAt"], { where: `"status" = 'PENDING'` })
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    concertId!: string;

    @Column({ type: "uuid" })
    userId!: string;

    @Column({ type: "uuid" })
    ticketId!: string;

    @Column({
        type: "enum",
        enum: ReservationStatus,
        default: ReservationStatus.PENDING
    })
    status!: ReservationStatus;

    @Column({ type: "timestamptz" })
    expiresAt!: Date;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // relations 

    @ManyToOne(() => Concert, { onDelete: "CASCADE" })
    @JoinColumn({ name: "concertId" })
    concert!: Concert;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => Ticket, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ticketId" })
    ticket!: Ticket;
}
