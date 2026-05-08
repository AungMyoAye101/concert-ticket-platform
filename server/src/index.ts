import "reflect-metadata";
import app from "./app";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./lib/data-source";
import { log } from "./utils/logger";
import * as Sentry from "@sentry/node";
import http from "http";


dotenv.config();
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || "development",
    });
}

const PORT = process.env.PORT || 3000;
app.get("/", (_req: Request, res: Response) => {
    res.json({
        success:true,
        message: `Server is running on http://localhost:${PORT}` });
});




let server: http.Server;

AppDataSource.initialize()
    .then(async () => {
        log.info("Database connected and initialized successfully");
        server = app.listen(PORT, () => {
            log.info(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        log.error("Error during Data Source initialization", { error });
        process.exit(1);
    });

const shutdown = async (signal: string) => {
    log.info("Shutdown signal received", { signal });
    server?.close(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        log.info("Graceful shutdown completed");
        process.exit(0);
    });
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
