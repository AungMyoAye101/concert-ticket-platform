import { DataSource } from "typeorm";
import { User } from "../entities/user-entity";
import { Concert } from "../entities/concert-entity";
import { Reservation } from "../entities/reservation-entity";
import { Ticket } from "../entities/ticket-entity";
import { ReservationStatus } from "../entities/reservation-entity";
import { AppDataSource } from "./data-source";
async function seedDatabase(dataSource: DataSource) {
    const userRepo = dataSource.getRepository(User);
    const concertRepo = dataSource.getRepository(Concert);
    const ticketRepo = dataSource.getRepository(Ticket);
    const reservationRepo = dataSource.getRepository(Reservation);

    console.log("🌱 Seeding database...");

    // ပုံမှန်အားဖြင့် Seed မလုပ်ခင် Data အဟောင်းတွေကို ဖျက်လေ့ရှိပါတယ် (ရွေးချယ်နိုင်သည်)
    await userRepo.clear();
    await concertRepo.clear();
    await ticketRepo.clear();
    await reservationRepo.clear();

    // 1. Seed Users
    const users = userRepo.create([
        { name: "Aung Aung", email: "aung@example.com", password: "hashed_password_1" },
        { name: "Su Su", email: "susu@example.com", password: "hashed_password_2" },
    ]);
    await userRepo.save(users);

    // 2. Seed Concerts (High Demand စမ်းသပ်ရန် Stock နည်းနည်းနှင့် များများ ခွဲထည့်ထားပါသည်)
    const concerts = concertRepo.create([
        {
            title: "Rock Revolution 2026",
            date: new Date("2026-12-25T19:00:00Z"),
            venue: "Yangon Thuwunna Stadium",
            stock: 5000 // Stock အများကြီးရှိတဲ့ပွဲ
        },
        {
            title: "Exclusive VIP Acoustic Night",
            date: new Date("2026-11-15T18:00:00Z"),
            venue: "Mandalay City Hall",
            stock: 50 // Stock နည်းနည်းပဲရှိတဲ့ပွဲ (Concurrency စမ်းရန် အကောင်းဆုံး)
        }
    ]);
    await concertRepo.save(concerts);

    // 3. Seed Tickets
    const tickets = ticketRepo.create([
        // Tickets for Rock Revolution 2026
        { concertId: concerts[0].id, seatNumber: "A1", price: 50, status: "available", category: "GENERAL" },
        { concertId: concerts[0].id, seatNumber: "A2", price: 50, status: "available", category: "GENERAL" },
        { concertId: concerts[0].id, seatNumber: "A3", price: 50, status: "available", category: "GENERAL" },
        { concertId: concerts[0].id, seatNumber: "B1", price: 50, status: "available", category: "GENERAL" },
        { concertId: concerts[0].id, seatNumber: "B2", price: 50, status: "available", category: "GENERAL" },
        // Tickets for Exclusive VIP Acoustic Night
        { concertId: concerts[1].id, seatNumber: "VIP1", price: 200, status: "available", category: "VIP" },
        { concertId: concerts[1].id, seatNumber: "VIP2", price: 200, status: "available", category: "VIP" },
        { concertId: concerts[1].id, seatNumber: "VIP3", price: 200, status: "available", category: "VIP" },
        { concertId: concerts[1].id, seatNumber: "VIP4", price: 200, status: "available", category: "VIP" },
        { concertId: concerts[1].id, seatNumber: "VIP5", price: 200, status: "available", category: "VIP" },
    ]);
    await ticketRepo.save(tickets);

    // 4. Seed Reservations
    const reservations = reservationRepo.create([
        {
            concertId: concerts[0].id,
            userId: users[0].id,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 1 day
            ticket: tickets[0]
        },
        {
            concertId: concerts[0].id,
            userId: users[1].id,
            status: ReservationStatus.COMPLETED,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            ticket: tickets[1]
        },
        {
            concertId: concerts[1].id,
            userId: users[0].id,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
            ticket: tickets[5] // VIP1
        },
    ]);
    await reservationRepo.save(reservations);

    console.log("✅ Database successfully seeded!");
}
async () => await seedDatabase(AppDataSource);
