import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Concert {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    title!: string;

    @Column({ type: "datetime" })
    date!: Date;

    @Column({ type: "varchar" })
    venue!: string;

    @Column({ type: "integer" })
    stock!: number;
}