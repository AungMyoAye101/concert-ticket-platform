import { Ticket } from "../entities/ticket-entity";

export const toTicketDto = (ticket: Ticket) => ({
    id: ticket.id,
    concertId: ticket.concertId,
    seatNumber: ticket.seatNumber,
    price: Number(ticket.price),
    status: ticket.status,
    category: ticket.category,
});
