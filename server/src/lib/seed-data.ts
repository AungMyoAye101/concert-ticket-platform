import { DataSource } from "typeorm";
import { User } from "../entities/user-entity";
import { Concert } from "../entities/concert-entity";
import { Reservation } from "../entities/reservation-entity";
import {
  Ticket,
  TicketCategory,
  TicketStatus,
} from "../entities/ticket-entity";
import { ReservationStatus } from "../entities/reservation-entity";
import { AppDataSource } from "./data-source";
import { hashPassword } from "../services/auth-service";

async function seedDatabase(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const concertRepo = dataSource.getRepository(Concert);
  const ticketRepo = dataSource.getRepository(Ticket);
  const reservationRepo = dataSource.getRepository(Reservation);

  console.log("Seeding database...");

  await dataSource.query(`
  TRUNCATE TABLE
    reservation,
    ticket,
    concert,
    "user"
  RESTART IDENTITY CASCADE;
`);

  // 1. Seed Users
  const users = userRepo.create([
    {
      name: "Aung Aung",
      email: "aung@gmail.com",
      password: await hashPassword("123456"),
    },
    {
      name: "Su Su",
      email: "susu@gmail.com",
      password: await hashPassword("123456"),
    },
    {
      name: "Kalayar",
      email: "kalayar@gmail.com",
      password: await hashPassword("123456"),
    },
    {
      name: "Za Za",
      email: "zaza@gmail.com",
      password: await hashPassword("123456"),
    },
  ]);

  await userRepo.save(users);

  // 2. Seed Concerts
  const concerts = concertRepo.create([
    {
      title: "Rock Revolution 2026",
      date: new Date("2026-12-25T19:00:00Z"),
      venue: "Yangon Thuwunna Stadium",
      stock: 10,
    },
    {
      title: "Exclusive VIP Acoustic Night",
      date: new Date("2026-11-15T18:00:00Z"),
      venue: "Mandalay City Hall",
      stock: 10,
    },
    {
      title: "Summer EDM Festival",
      date: new Date("2026-08-10T20:00:00Z"),
      venue: "Ngapali Beach Stage",
      stock: 10,
    },
    {
      title: "Classic Legends Live",
      date: new Date("2026-09-05T17:30:00Z"),
      venue: "Naypyidaw Convention Center",
      stock: 10,
    },
  ]);

  await concertRepo.save(concerts);

  // 3. Seed Tickets
  const ticketsData: Partial<Ticket>[] = [];

  concerts.forEach((concert, index) => {
    // 6 General Tickets
    for (let i = 1; i <= 6; i++) {
      ticketsData.push({
        concertId: concert.id,
        seatNumber: `G${index + 1}-${i}`,
        price: 50,
        status: TicketStatus.AVAILABLE,
        category: TicketCategory.GENERAL,
      });
    }

    // 4 VIP Tickets
    for (let i = 1; i <= 4; i++) {
      ticketsData.push({
        concertId: concert.id,
        seatNumber: `VIP${index + 1}-${i}`,
        price: 200,
        status: TicketStatus.AVAILABLE,
        category: TicketCategory.VIP,
      });
    }
  });

  const tickets = ticketRepo.create(ticketsData);
  await ticketRepo.save(tickets);

  // 4. Seed Reservations
  const reservations = reservationRepo.create([
    {
      concertId: concerts[0].id,
      userId: users[0].id,
      status: ReservationStatus.PENDING,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ticketId: tickets[0].id,
    },
    {
      concertId: concerts[1].id,
      userId: users[1].id,
      status: ReservationStatus.COMPLETED,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ticketId: tickets[10].id,
    },
    {
      concertId: concerts[2].id,
      userId: users[2].id,
      status: ReservationStatus.PENDING,
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      ticketId: tickets[20].id,
    },
    {
      concertId: concerts[3].id,
      userId: users[3].id,
      status: ReservationStatus.COMPLETED,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      ticketId: tickets[30].id,
    },
  ]);

  await reservationRepo.save(reservations);

  console.log("Database successfully seeded!");
}

AppDataSource.initialize()
  .then((dataSource) => seedDatabase(dataSource))
  .then(() => AppDataSource.destroy())
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  });
