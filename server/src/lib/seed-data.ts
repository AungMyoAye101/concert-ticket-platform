import { DataSource } from "typeorm";
import { User } from "../entities/user-entity";
import { Concert } from "../entities/concert-entity";
import { AppDataSource } from "./data-source";
async function seedDatabase(dataSource: DataSource) {
    const userRepo = dataSource.getRepository(User);
    const concertRepo = dataSource.getRepository(Concert);

    console.log("🌱 Seeding database...");

    // ပုံမှန်အားဖြင့် Seed မလုပ်ခင် Data အဟောင်းတွေကို ဖျက်လေ့ရှိပါတယ် (ရွေးချယ်နိုင်သည်)
    await userRepo.clear();
    await concertRepo.clear();

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

    console.log("✅ Database successfully seeded!");
}
async () => await seedDatabase(AppDataSource);
