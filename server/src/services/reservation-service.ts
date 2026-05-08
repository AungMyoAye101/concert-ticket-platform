import { ConflictError, NotFoundError } from "../common/errors/http-errors";
import { Concert } from "../entities/concert-entity";
import { Reservation, ReservationStatus } from "../entities/reservation-entity";
import { Ticket, TicketStatus } from "../entities/ticket-entity";
import { AppDataSource } from "../lib/data-source";
import { LessThanOrEqual } from "typeorm";


export const reserve = async (userId: string, concertId: string, quantity = 1) => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const result = await queryRunner.manager
            .createQueryBuilder()
            .update(Concert)
            .set({ stock: () => `stock - ${quantity}` })
            .where("id = :id AND stock >= :quantity", { id: concertId, quantity })
            .execute();

        if (result.affected === 0) {
            throw new ConflictError("Tickets are sold out");
        }

        const tickets = await queryRunner.manager
            .createQueryBuilder(Ticket, "ticket")
            .setLock("pessimistic_write")
            .where("ticket.concertId = :concertId", { concertId })
            .andWhere("ticket.status = :status", { status: TicketStatus.AVAILABLE })
            .orderBy("ticket.seatNumber", "ASC")
            .limit(quantity)
            .getMany();

        if (tickets.length < quantity) {
            throw new ConflictError("Not enough tickets are available");
        }

        const reservations = [];
        for (const ticket of tickets) {
            ticket.status = TicketStatus.RESERVED;
            await queryRunner.manager.save(ticket);

            const reservation = queryRunner.manager.create(Reservation, {
                userId,
                concertId,
                ticketId: ticket.id,
                status: ReservationStatus.PENDING,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            });
            reservations.push(await queryRunner.manager.save(reservation));
        }

        await queryRunner.commitTransaction();

        return reservations;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
};

export const purchase = async (reservationId: string) => {
    const repo = AppDataSource.getRepository(Reservation);

    const reservation = await repo.findOneBy({
        id: reservationId,
        status: ReservationStatus.PENDING,
    });

    if (!reservation) {
        throw new NotFoundError("Reservation not found");
    }

    reservation.status = ReservationStatus.COMPLETED;
    await AppDataSource.getRepository(Ticket).update({ id: reservation.ticketId }, { status: TicketStatus.SOLD });

    return repo.save(reservation);
};

export const cleanupExpiredReservations = async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const expired = await queryRunner.manager.find(Reservation, {
            where: {
                status: ReservationStatus.PENDING,
                expiresAt: LessThanOrEqual(new Date()),
            },
        });

        for (const reservation of expired) {
            reservation.status = ReservationStatus.EXPIRED;
            await queryRunner.manager.save(reservation);
            await queryRunner.manager.update(Ticket, { id: reservation.ticketId }, { status: TicketStatus.AVAILABLE });
            await queryRunner.manager.increment(Concert, { id: reservation.concertId }, "stock", 1);
        }

        await queryRunner.commitTransaction();
        return { expiredCount: expired.length };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
};
