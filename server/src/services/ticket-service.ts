import { ConflictError, NotFoundError } from "../common/errors/http-errors";
import { Concert } from "../entities/concert-entity";
import { Reservation, ReservationStatus } from "../entities/reservation-entity";
import { Ticket, TicketStatus } from "../entities/ticket-entity";
import { AppDataSource } from "../lib/data-source";
import { CreateTicketInput } from "../validators/ticket-schema";

const reservationExpiry = () => new Date(Date.now() + 5 * 60 * 1000);

export const getTickets = async () => {
    return AppDataSource.getRepository(Ticket).find({
        order: { seatNumber: "ASC" },
    });
};

export const createTicket = async (payload: CreateTicketInput) => {
    const concert = await AppDataSource.getRepository(Concert).findOneBy({ id: payload.concertId });
    if (!concert) {
        throw new NotFoundError("Concert not found");
    }

    const ticket = AppDataSource.getRepository(Ticket).create({
        ...payload,
        status: TicketStatus.AVAILABLE,
    });

    await AppDataSource.getRepository(Concert).increment({ id: payload.concertId }, "stock", 1);
    return AppDataSource.getRepository(Ticket).save(ticket);
};

export const reserveTicketOptimistic = async (userId: string, ticketId: string) => {
    return AppDataSource.transaction(async (manager) => {
        const ticket = await manager.findOne(Ticket, {
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        if (ticket.status !== TicketStatus.AVAILABLE) {
            throw new ConflictError("Ticket is not available");
        }

        const updateResult = await manager
            .createQueryBuilder()
            .update(Ticket)
            .set({
                status: TicketStatus.RESERVED,
                version: () => "version + 1",
            })
            .where("id = :ticketId", { ticketId })
            .andWhere("version = :version", { version: ticket.version })
            .andWhere("status = :status", { status: TicketStatus.AVAILABLE })
            .execute();

        if (updateResult.affected !== 1) {
            throw new ConflictError("Ticket was reserved by another request");
        }

        const stockResult = await manager
            .createQueryBuilder()
            .update(Concert)
            .set({ stock: () => "stock - 1" })
            .where("id = :concertId AND stock > 0", { concertId: ticket.concertId })
            .execute();

        if (stockResult.affected !== 1) {
            throw new ConflictError("Tickets are sold out");
        }

        const reservation = manager.create(Reservation, {
            userId,
            concertId: ticket.concertId,
            ticketId: ticket.id,
            status: ReservationStatus.PENDING,
            expiresAt: reservationExpiry(),
        });

        return manager.save(reservation);
    });
};

export const reserveTicketPessimistic = async (userId: string, ticketId: string) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const ticket = await queryRunner.manager.findOne(Ticket, {
            where: { id: ticketId },
            lock: { mode: "pessimistic_write" },
        });

        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        if (ticket.status !== TicketStatus.AVAILABLE) {
            throw new ConflictError("Ticket is not available");
        }

        ticket.status = TicketStatus.RESERVED;
        await queryRunner.manager.save(ticket);

        const stockResult = await queryRunner.manager
            .createQueryBuilder()
            .update(Concert)
            .set({ stock: () => "stock - 1" })
            .where("id = :concertId AND stock > 0", { concertId: ticket.concertId })
            .execute();

        if (stockResult.affected !== 1) {
            throw new ConflictError("Tickets are sold out");
        }

        const reservation = queryRunner.manager.create(Reservation, {
            userId,
            concertId: ticket.concertId,
            ticketId: ticket.id,
            status: ReservationStatus.PENDING,
            expiresAt: reservationExpiry(),
        });

        const saved = await queryRunner.manager.save(reservation);
        await queryRunner.commitTransaction();
        return saved;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
};
