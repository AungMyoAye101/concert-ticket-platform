import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { AppDataSource } from "../lib/data-source";
import { User } from "../entities/user-entity";
import {
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} from "../common/errors/http-errors";

export type AuthUser = Pick<User, "id" | "name" | "email">;

type AuthTokenPayload = {
  sub: string;
  email: string;
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new InternalServerError("JWT_SECRET is not configured");
  }

  return "dev-jwt-secret-change-me";
};

export const mapAuthUser = (user: User): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOneBy({ email });

  if (existing) {
    throw new ConflictError("Email already in use");
  }

  const user = repo.create({
    name,
    email,
    password: await hashPassword(password),
  });
  return repo.save(user);
};

export const loginUser = async (email: string, password: string) => {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOneBy({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email } satisfies AuthTokenPayload,
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN } as SignOptions,
  );

  return {
    token,
    tokenType: "Bearer",
    expiresIn: JWT_EXPIRES_IN,
    user: mapAuthUser(user),
  };
};

export const verifyAuthToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: payload.sub,
    });

    if (!user) {
      throw new UnauthorizedError("Invalid authentication token");
    }

    return mapAuthUser(user);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError("Invalid authentication token");
  }
};
