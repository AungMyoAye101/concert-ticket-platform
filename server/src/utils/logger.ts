import pino from "pino";
import { asyncLocalStorage } from "../middlewares/correlation-middleware";


export const logger = pino({
    transport: {
        target: "pino-pretty",
    },
});

export const log = {
    info: (msg: string, data?: any) => {
        const store = asyncLocalStorage.getStore();
        logger.info({
            correlationId: store?.get("correlationId"),
            msg,
            ...data,
        });
    },
};