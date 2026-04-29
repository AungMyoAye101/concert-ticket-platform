import "reflect-metadata";
import app from "./app";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./lib/data-source";


dotenv.config();
const PORT = process.env.PORT || 3000;
app.get("/", (_req: Request, res: Response) => {
    res.json({ message: `Server in running on http://localhost:${PORT}` });
});




// ၁။ Database ကို အရင်ဆုံး Initialize လုပ်ပါမည်
AppDataSource.initialize()
    .then(async () => {
        console.log("✅ Database connected and initialized successfully!");
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Error during Data Source initialization:", error);
    });