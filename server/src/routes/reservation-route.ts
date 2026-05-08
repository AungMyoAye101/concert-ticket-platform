import { Router } from "express";
import { validate } from "../middlewares/validation-middleware";
import { createPurchaseSchema, createReserveSchema } from "../validators/reservation-schema";
import { asyncCatchFn } from "../utils/async-catch-fn";
import { cleanupReservationsController, purchaseTicket, reserveTicket } from "../controllers/reservation-controller";
import { reserveRateLimiter } from "../middlewares/rate-limit-middleware";



const router = Router();

router.post(
    "/reserve",
    reserveRateLimiter,
    validate(createReserveSchema),
    asyncCatchFn(reserveTicket)
);

router.post(
    "/purchase",
    validate(createPurchaseSchema),
    asyncCatchFn(purchaseTicket)
);

router.post(
    "/cleanup/reservations",
    asyncCatchFn(cleanupReservationsController)
);

export default router;
