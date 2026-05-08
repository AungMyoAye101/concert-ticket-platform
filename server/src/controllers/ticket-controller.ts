import { Request, Response } from "express";
import { successResponse } from "../common/success-response";
import { toTicketDto } from "../dtos/ticket-dto";
import {
    createTicket,
    getTickets,
    reserveTicketOptimistic,
    reserveTicketPessimistic,
} from "../services/ticket-service";

export const getTicketsController = async (_req: Request, res: Response) => {
    const tickets = await getTickets();
    return successResponse(res, 200, "Ticket list fetched", tickets.map(toTicketDto));
};

export const createTicketController = async (req: Request, res: Response) => {
    const ticket = await createTicket(req.body);
    return successResponse(res, 201, "Ticket created", toTicketDto(ticket));
};

export const reserveTicketOptimisticController = async (req: Request, res: Response) => {
    const { userId, ticketId } = req.body;
    const reservation = await reserveTicketOptimistic(userId, ticketId);
    return successResponse(res, 201, "Ticket reserved with optimistic locking", reservation);
};

export const reserveTicketPessimisticController = async (req: Request, res: Response) => {
    const { userId, ticketId } = req.body;
    const reservation = await reserveTicketPessimistic(userId, ticketId);
    return successResponse(res, 201, "Ticket reserved with pessimistic locking", reservation);
};
