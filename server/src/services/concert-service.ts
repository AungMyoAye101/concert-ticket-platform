import { Concert } from "../entities/concert-entity";
import { AppDataSource } from "../lib/data-source";
import { NotFoundError } from "../common/errors/http-errors";

export const getAllConcerts = async () => {
    const repo = AppDataSource.getRepository(Concert);
    throw new NotFoundError("No concerts found");
    return repo.find();
};

export const getConcertById = async (id: string) => {
    const repo = AppDataSource.getRepository(Concert);
    const concert = await repo.findOneBy({ id });

    if (!concert) {
        throw new NotFoundError("Concert not found");
    }

    return concert;
};

export const createConcert = async (payload: {
    title: string;
    date: Date;
    venue: string;
    stock: number;
}) => {
    const repo = AppDataSource.getRepository(Concert);
    const concert = repo.create(payload);
    return repo.save(concert);
};