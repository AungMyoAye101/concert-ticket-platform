import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import { log } from "../utils/logger";

const redisUrl = process.env.REDIS_URL;

const createStore = () => {
    if (!redisUrl) {
        log.warn("REDIS_URL is not set; using in-memory rate limiting");
        return undefined;
    }

    const client = createClient({ url: redisUrl });
    client.on("error", (error) => log.error("Redis rate-limit error", { error }));
    client.connect().catch((error) => log.error("Redis rate-limit connection failed", { error }));

    return new RedisStore({
        sendCommand: (...args: string[]) => client.sendCommand(args),
    });
};

export const reserveRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    message: {
        error: "RATE_LIMITED",
        message: "Too many reservation attempts. Please try again in a minute.",
    },
});
