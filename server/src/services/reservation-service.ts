import { ConflictError, NotFoundError } from "../common/errors/http-errors";
import { Concert } from "../entities/concert-entity";
import { Reservation, ReservationStatus } from "../entities/reservation-entity";
import { Ticket } from "../entities/ticket-entity";
import { AppDataSource } from "../lib/data-source";


export const reserve = async (userId: string, concertId: string) => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const result = await queryRunner.manager
            .createQueryBuilder()
            .update(Concert)
            .set({ stock: () => "stock - 1" })
            .where("id = :id AND stock > 0", { id: concertId })
            .execute();
        console.log(result);
        if (result.affected === 0) {
            throw new ConflictError("Tickets are sold out");
        }

        const ticket = await queryRunner.manager.findOneBy(Ticket, {
            concertId,
        });

        if (!ticket) throw new NotFoundError("Ticket not found");

        const reservation = queryRunner.manager.create(Reservation, {
            userId,
            ticketId: ticket.id,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await queryRunner.manager.save(reservation);

        await queryRunner.commitTransaction();

        return reservation;
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

    return repo.save(reservation);
};