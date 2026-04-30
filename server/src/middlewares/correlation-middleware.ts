import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { AsyncLocalStorage } from "async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

export const correlationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const store = new Map<string, string>();

    const correlationId =
        req.headers["x-correlation-id"]?.toString() || randomUUID();

    store.set("correlationId", correlationId);

    asyncLocalStorage.run(store, () => {
        res.setHeader("X-Correlation-ID", correlationId);
        next();
    });
};