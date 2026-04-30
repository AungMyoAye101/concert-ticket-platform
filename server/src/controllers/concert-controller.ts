import { Request, Response } from "express";
import {
    createConcert,
    getAllConcerts,
} from "../services/concert-service";
import { successResponse } from "../common/success-response";
import { asyncCatchFn } from "../utils/async-catch-fn";

export const getConcertsController = asyncCatchFn(async (_req: Request, res: Response) => {
    const data = await getAllConcerts();

    return successResponse(res, 200, "Concert list fetched", data);
});

// export const getConcertByIdController = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const concert = await getConcertById(id);

//     return successResponse(res, 200, "Concert fetched", concert);
// };

export const createConcertController = asyncCatchFn(
    async (req: Request, res: Response) => {
        const { title, date, venue, stock } = req.body;
        console.log("Received concert data:", { title, date, venue, stock }); // Debug log
        const concert = await createConcert({
            title,
            date: new Date(date),
            venue,
            stock,
        });

        return successResponse(res, 201, "Concert created", concert);
    });