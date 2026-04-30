import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { asyncLocalStorage } from "./correlation-middleware";
import { AppError } from "../common/errors";

export const globalErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
) => {
    const store = asyncLocalStorage.getStore();
    const correlationId = store?.get("correlationId");

    let statusCode = 500;
    let message = "Internal Server Error";
    let code = "INTERNAL_ERROR";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // log full error (important for Day 3)
    logger.error({
        correlationId,
        message: err.message,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: code,
        ref: correlationId,
    });
};