import { Request, Response } from "express";
import { successResponse } from "../common/success-response";
import { purchase, reserve } from "../services/reservation-service";


export const reserveTicket = async (req: Request, res: Response) => {
    const { userId, concertId } = req.body;

    const result = await reserve(userId, concertId);

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