import { Router } from "express";
import { validate } from "../middlewares/validation-middleware";
import { createPurchaseSchema, createReserveSchema } from "../validators/reservation-schema";
import { asyncCatchFn } from "../utils/async-catch-fn";
import { purchaseTicket, reserveTicket } from "../controllers/reservation-controller";



const router = Router();

router.post(
    "/reserve",
    validate(createReserveSchema),
    asyncCatchFn(reserveTicket)
);

router.post(
    "/purchase",
    validate(createPurchaseSchema),
    asyncCatchFn(purchaseTicket)
);

export default router;