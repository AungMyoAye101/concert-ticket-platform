import { Router } from "express";
import { validate } from "../middlewares/validation-middleware";
import {
    createConcertController,
    getConcertsController,
} from "../controllers/concert-controller";
import { createConcertSchema } from "../validators/concert-schema";

const route = Router();

route.get("/concerts", getConcertsController);
// route.get("/concerts/:id", asyncCatchFn(getConcertByIdController));
route.post("/concerts", validate(createConcertSchema), createConcertController);

export default route;