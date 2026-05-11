import { AppDataSource } from "../lib/data-source";
import { User } from "../entities/user-entity";
import { NotFoundError } from "../common/errors/http-errors";

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
