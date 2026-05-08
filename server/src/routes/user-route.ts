import { Router } from "express";
import { validate } from "../middlewares/validation-middleware";
import { asyncCatchFn } from "../utils/async-catch-fn";
import { createUserController, getUserByIdController, getUsersController } from "../controllers/user-controller";
import { createUserSchema } from "../validators/user-schema";

const router = Router();

router.get("/", asyncCatchFn(getUsersController));
router.get("/:id", asyncCatchFn(getUserByIdController));
router.post("/", validate(createUserSchema), asyncCatchFn(createUserController));

export default router;
