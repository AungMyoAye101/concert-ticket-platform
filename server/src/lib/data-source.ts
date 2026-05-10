import "reflect-metadata";
import { DataSource } from "typeorm";
import { Concert } from "../entities/concert-entity";
import { Reservation } from "../entities/reservation-entity";
import { User } from "../entities/user-entity";
import { Ticket } from "../entities/ticket-entity";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  // host: process.env.DB_HOST || "localhost",
  // port: Number(process.env.DB_PORT || 5432),
  // username: process.env.DB_USERNAME || "postgres",
  // password: process.env.DB_PASSWORD || "postgres",
  // database: process.env.DB_NAME || "concert_ticket_platform",
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === "true",
  entities: [User, Concert, Reservation, Ticket],
  migrations: [
    process.env.NODE_ENV === "production"
      ? "dist/migrations/**/*.js"
      : "src/migrations/**/*.ts",
  ],
});
