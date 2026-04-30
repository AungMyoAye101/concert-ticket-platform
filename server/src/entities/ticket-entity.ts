import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Concert } from "./concert-entity";
export enum TicketCategory {
    VIP = "VIP",
    GENERAL = "GENERAL",
}
@Entity()
export class Ticket {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    concertId!: string;

    @Column({ type: "varchar" })
    seatNumber!: string;

    @Column({ type: "decimal" })
    price!: number;

    @Column({ type: "varchar" })
    status!: string;

    @Column({
        type: "text",
        enum: TicketCategory,
        default: TicketCategory.GENERAL
    })
    category!: string;

    @ManyToOne(() => Concert, (concert) => concert.tickets, { onDelete: "CASCADE" })
    concert!: Concert;

}