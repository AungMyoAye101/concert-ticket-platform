import { Router } from "express";
import {
  createUserController,
  loginController,
  logoutController,
  meController,
} from "../controllers/auth-controller";
import { requireAuth } from "../middlewares/auth-middleware";
import { validate } from "../middlewares/validation-middleware";
import { asyncCatchFn } from "../utils/async-catch-fn";
import { loginSchema } from "../validators/auth-schema";
import { createUserSchema } from "../validators/user-schema";

const router = Router();

router.post(
  "/register",
  validate(createUserSchema),
  asyncCatchFn(createUserController),
);
router.post("/login", validate(loginSchema), asyncCatchFn(loginController));
router.post(
  "/logout",
  asyncCatchFn(requireAuth),
  asyncCatchFn(logoutController),
);
router.get("/me", asyncCatchFn(requireAuth), asyncCatchFn(meController));

export default router;
