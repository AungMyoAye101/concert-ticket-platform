import "reflect-metadata";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, VersionColumn } from "typeorm";
import { Concert } from "./concert-entity";

export enum TicketCategory {
    VIP = "VIP",
    GENERAL = "GENERAL",
}

export enum TicketStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    SOLD = "SOLD",
}

@Entity()
@Index("idx_ticket_concert_id", ["concertId"])
export class Ticket {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    concertId!: string;

    @Column({ type: "varchar" })
    seatNumber!: string;

    @Column({ type: "numeric", precision: 10, scale: 2 })
    price!: number;

    @Column({
        type: "enum",
        enum: TicketStatus,
        default: TicketStatus.AVAILABLE,
    })
    status!: TicketStatus;

    @Column({
        type: "enum",
        enum: TicketCategory,
        default: TicketCategory.GENERAL
    })
    category!: TicketCategory;

    @Column({ name: "internal_note", type: "text", nullable: true })
    internalNote?: string | null;

    @VersionColumn()
    version!: number;

    @ManyToOne(() => Concert, (concert) => concert.tickets, { onDelete: "CASCADE" })
    concert!: Concert;

}
