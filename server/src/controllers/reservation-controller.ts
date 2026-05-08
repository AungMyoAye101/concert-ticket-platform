import { Request, Response } from "express";
import { successResponse } from "../common/success-response";
import { cleanupExpiredReservations, purchase, reserve } from "../services/reservation-service";


export const reserveTicket = async (req: Request, res: Response) => {
    const { userId, concertId, quantity } = req.body;

    const result = await reserve(userId, concertId, quantity);

    return successResponse(
        res,
        201,
        "Reservation created",
        result,
    );
};

export const purchaseTicket = async (req: Request, res: Response) => {
    const { reservationId } = req.body;

    const result = await purchase(reservationId);

    return successResponse(
        res,
        201,
        "Purchase successful",
        result,
    );

};

export const cleanupReservationsController = async (_req: Request, res: Response) => {
    const result = await cleanupExpiredReservations();
    return successResponse(res, 200, "Expired reservations released", result);
};
