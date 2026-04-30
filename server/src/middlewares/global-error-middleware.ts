import { NextFunction, Request, Response } from "express";
import { asyncLocalStorage } from "./correlation-middleware";
import { AppError } from "../common/errors";

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
    }

    // log full error (important for Day 3)
    // logger.error({
    //     correlationId,
    //     message: err.message,
    //     stack: err.stack,
    // });

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: code,
        ref: correlationId,
    });
};