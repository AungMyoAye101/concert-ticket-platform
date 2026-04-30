import { AppDataSource } from "../lib/data-source";
import { User } from "../entities/user-entity";
import { ConflictError, NotFoundError } from "../common/errors/http-errors";

export const createUser = async (name: string, email: string, password: string) => {
    const repo = AppDataSource.getRepository(User);
    const existing = await repo.findOneBy({ email });

    if (existing) {
        throw new ConflictError("Email already in use");
    }

    const user = repo.create({ name, email, password });
    return repo.save(user);
};

export const getAllUsers = async () => {
    return AppDataSource.getRepository(User).find();
};

export const getUserById = async (id: string) => {
    const user = await AppDataSource.getRepository(User).findOneBy({ id });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
};
