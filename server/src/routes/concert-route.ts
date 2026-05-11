import { Router } from "express";
import { validate } from "../middlewares/validation-middleware";
import {
  createConcertController,
  getConcertByIdController,
  getConcertsController,
} from "../controllers/concert-controller";
import { createConcertSchema } from "../validators/concert-schema";
import { asyncCatchFn } from "../utils/async-catch-fn";

const route = Router();

route.get("/", asyncCatchFn(getConcertsController));
route.get("/:id", asyncCatchFn(getConcertByIdController));
route.post(
  "/",
  validate(createConcertSchema),
  asyncCatchFn(createConcertController),
);

export default route;
