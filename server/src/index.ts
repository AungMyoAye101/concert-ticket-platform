import app from "./app";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;
app.get("/", (_req: Request, res: Response) => {
    res.json({ message: `Server in running on http://localhost:${PORT}` });
});

app.listen(PORT, () => {
    console.log(`Server in running on http://localhost:${PORT}`);
});