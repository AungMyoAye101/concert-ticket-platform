import pino from "pino";
import { asyncLocalStorage } from "../middlewares/correlation-middleware";


export const logger = pino({
    transport: process.env.NODE_ENV === "production" ? undefined : {
        target: "pino-pretty",
    },
});

const correlationId = () => asyncLocalStorage.getStore()?.get("correlationId");

export const log = {
    info: (msg: string, data?: any) => {
        logger.info({
            correlationId: correlationId(),
            msg,
            ...data,
        });
    },
    warn: (msg: string, data?: any) => {
        logger.warn({
            correlationId: correlationId(),
            msg,
            ...data,
        });
    },
    error: (msg: string, data?: any) => {
        logger.error({
            correlationId: correlationId(),
            msg,
            ...data,
        });
    },
};
