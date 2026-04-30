import { z } from "zod";

export const createConcertSchema = z.object({
    title: z.string().min(1, "Title is required"),
    date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Invalid date format",
    }),
    venue: z.string().min(1, "Venue is required"),
    stock: z.number().int().nonnegative("Stock must be zero or greater"),
});

export type CreateConcertType = z.infer<typeof createConcertSchema>;
