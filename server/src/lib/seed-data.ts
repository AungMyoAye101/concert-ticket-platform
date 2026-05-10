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

  await reservationRepo.clear();
  await ticketRepo.clear();
  await concertRepo.clear();
  await userRepo.clear();

  // 1. Seed Users
  const users = userRepo.create([
    {
      name: "Aung Aung",
      email: "aung@example.com",
      password: await hashPassword("password123"),
    },
    {
      name: "Su Su",
      email: "susu@example.com",
      password: await hashPassword("password123"),
    },
  ]);
  await userRepo.save(users);

  const concerts = concertRepo.create([
    {
      title: "Rock Revolution 2026",
      date: new Date("2026-12-25T19:00:00Z"),
      venue: "Yangon Thuwunna Stadium",
      stock: 5000,
    },
    {
      title: "Exclusive VIP Acoustic Night",
      date: new Date("2026-11-15T18:00:00Z"),
      venue: "Mandalay City Hall",
      stock: 50,
    },
  ]);
  await concertRepo.save(concerts);

  // 3. Seed Tickets
  const tickets = ticketRepo.create([
    // Tickets for Rock Revolution 2026
    {
      concertId: concerts[0].id,
      seatNumber: "A1",
      price: 50,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.GENERAL,
    },
    {
      concertId: concerts[0].id,
      seatNumber: "A2",
      price: 50,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.GENERAL,
    },
    {
      concertId: concerts[0].id,
      seatNumber: "A3",
      price: 50,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.GENERAL,
    },
    {
      concertId: concerts[0].id,
      seatNumber: "B1",
      price: 50,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.GENERAL,
    },
    {
      concertId: concerts[0].id,
      seatNumber: "B2",
      price: 50,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.GENERAL,
    },
    // Tickets for Exclusive VIP Acoustic Night
    {
      concertId: concerts[1].id,
      seatNumber: "VIP1",
      price: 200,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.VIP,
    },
    {
      concertId: concerts[1].id,
      seatNumber: "VIP2",
      price: 200,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.VIP,
    },
    {
      concertId: concerts[1].id,
      seatNumber: "VIP3",
      price: 200,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.VIP,
    },
    {
      concertId: concerts[1].id,
      seatNumber: "VIP4",
      price: 200,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.VIP,
    },
    {
      concertId: concerts[1].id,
      seatNumber: "VIP5",
      price: 200,
      status: TicketStatus.AVAILABLE,
      category: TicketCategory.VIP,
    },
  ]);
  await ticketRepo.save(tickets);

  // 4. Seed Reservations
  const reservations = reservationRepo.create([
    {
      concertId: concerts[0].id,
      userId: users[0].id,
      status: ReservationStatus.PENDING,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 1 day
      ticketId: tickets[0].id,
    },
    {
      concertId: concerts[0].id,
      userId: users[1].id,
      status: ReservationStatus.COMPLETED,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ticketId: tickets[1].id,
    },
    {
      concertId: concerts[1].id,
      userId: users[0].id,
      status: ReservationStatus.PENDING,
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      ticketId: tickets[5].id,
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
