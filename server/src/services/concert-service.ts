import { Concert } from "../entities/concert-entity";
import { AppDataSource } from "../lib/data-source"

export const getAllConcerts = async () => {
    const concertRepo = AppDataSource.getRepository(Concert);
    console.log("Fetching all concerts from the database...");
    const concerts = await concertRepo.find();
    console.log("Concerts retrieved:", concerts);
    // if (!concets) {
    //     throw new Error("No concerts found");
    // }
    return concerts;
}