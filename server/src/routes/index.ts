import { Router } from "express";
import healthRoute from "./health-route";
import reservationRoutes from "./reservation-route";
import concertRoute from "./concert-route";
import userRoute from "./user-route";

const router = Router();

router.use("/health", healthRoute);
router.use("/", reservationRoutes);
router.use("/", concertRoute);
router.use("/", userRoute);
router.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default router;