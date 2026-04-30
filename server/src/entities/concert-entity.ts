import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket-entity";

@Entity()
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