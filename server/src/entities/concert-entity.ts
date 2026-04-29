import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Concert {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column()
    date!: Date;

    @Column()
    venue!: string;

    @Column()
    stock!: number;
}