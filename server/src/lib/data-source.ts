import "reflect-metadata";
import { DataSource } from 'typeorm';
import { Concert } from '../entities/concert-entity';
import { Reservation } from '../entities/reservation-entity';
import { User } from "../entities/user-entity";
import { Ticket } from "../entities/ticket-entity";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: false,
    logging: true,
    entities: [User, Concert, Reservation, Ticket],
    migrations: ["src/migrations/**/*.ts"],
})