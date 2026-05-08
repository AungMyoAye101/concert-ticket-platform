import { Router } from "express";
import {
    createTicketController,
    getTicketsController,
    reserveTicketOptimisticController,
    reserveTicketPessimisticController,
} from "../controllers/ticket-controller";
import { asyncCatchFn } from "../utils/async-catch-fn";
import { validate } from "../middlewares/validation-middleware";
import { createTicketSchema, ticketReservationSchema } from "../validators/ticket-schema";
import { reserveRateLimiter } from "../middlewares/rate-limit-middleware";

const router = Router();

router.get("/", asyncCatchFn(getTicketsController));
router.post("/", validate(createTicketSchema), asyncCatchFn(createTicketController));
router.post(
    "/tickets/reserve/optimistic",
    reserveRateLimiter,
    validate(ticketReservationSchema),
    asyncCatchFn(reserveTicketOptimisticController)
);
router.post(
    "/reserve/pessimistic",
    reserveRateLimiter,
    validate(ticketReservationSchema),
    asyncCatchFn(reserveTicketPessimisticController)
);

export default router;
