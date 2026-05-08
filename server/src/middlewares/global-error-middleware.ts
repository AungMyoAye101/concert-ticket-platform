import { NextFunction, Request, Response } from "express";
import { asyncLocalStorage } from "./correlation-middleware";
import { AppError } from "../common/errors";
import { log } from "../utils/logger";
import * as Sentry from "@sentry/node";

export const globalErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const store = asyncLocalStorage.getStore();
    const correlationId = store?.get("correlationId");


    let statusCode = 500;
    let message = "Internal Server Error";
    let code = "INTERNAL_ERROR";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.constructor.name.replace("Error", "").toUpperCase() || code;
    }

    log.error("Global error handler", {
        correlationId,
        error: err.message,
        stack: err.stack,
    });
    Sentry.captureException(err, { tags: { correlationId } });

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: code,
        ref: correlationId,
    });
};
