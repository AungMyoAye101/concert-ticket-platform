import { Request, Response } from "express";
import { successResponse } from "../common/success-response";
import { getAllConcerts } from "../services/concert-service";

export const getAllConcertsController = async (_req: Request, res: Response) => {
    const data = await getAllConcerts();
    successResponse(res, 200, "Concerts retrieved successfully", data);
}