import * as z from "zod";

export const createReserveSchema = z.object({
    userId: z.uuidv4("Invalid user ID format"),
    concertId: z.uuidv4("Invalid concert ID format"),
}).strict();



export const createPurchaseSchema = z.object({
    reservationId: z.uuidv4("Invalid reservation ID format"),
}).strict();

export type createReserveType = z.infer<typeof createReserveSchema>;
export type createPurchaseType = z.infer<typeof createPurchaseSchema>;
