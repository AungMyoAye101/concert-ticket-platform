import { Router } from "express";
import healthRoute from "./health-route";
import reservationRoutes from "./reservation-route";
import concertRoute from "./concert-route";
import userRoute from "./user-route";
import ticketRoute from "./ticket-route";
import authRoute from "./auth-route";

const router = Router();

router.use("/health", healthRoute);
router.use("/", reservationRoutes);
router.use("/concerts", concertRoute);
router.use("/tickets", ticketRoute);
router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default router;
