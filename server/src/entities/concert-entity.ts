import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Ticket } from "./ticket-entity";

@Entity()
@Index("idx_concert_id", ["concertId"])
export class Concert {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "datetime" })
    date!: Date;

    @Column({ type: "varchar", length: 255 })
    venue!: string;

    @Column({ type: "integer", default: 0 })
    stock!: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    //relations
    @OneToMany(() => Ticket, (ticket) => ticket.concert)
    tickets!: Ticket[];
}