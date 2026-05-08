import * as z from "zod";
import { TicketCategory } from "../entities/ticket-entity";

export const createTicketSchema = z.object({
    concertId: z.uuidv4("Invalid concert ID format"),
    seatNumber: z.string().min(1).max(30),
    price: z.coerce.number().positive(),
    category: z.enum(TicketCategory).default(TicketCategory.GENERAL),
    internalNote: z.string().max(500).optional(),
}).strict();

export const ticketReservationSchema = z.object({
    userId: z.uuidv4("Invalid user ID format"),
    ticketId: z.uuidv4("Invalid ticket ID format"),
    quantity: z.number().int().min(1).max(5).default(1),
}).strict();

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type TicketReservationInput = z.infer<typeof ticketReservationSchema>;
