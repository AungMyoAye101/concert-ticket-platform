import { Router } from "express";
import { asyncCatchFn } from "../utils/async-catch-fn";
import {
  getUserByIdController,
  getUsersController,
} from "../controllers/user-controller";

const router = Router();

router.get("/", asyncCatchFn(getUsersController));
router.get("/:id", asyncCatchFn(getUserByIdController));

export default router;
