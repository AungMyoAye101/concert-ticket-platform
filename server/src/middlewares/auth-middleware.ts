import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../common/errors/http-errors";
import { verifyAuthToken } from "../services/auth-service";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedError("Authorization header is required");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new UnauthorizedError("Bearer token is required");
    }

    req.currentUser = await verifyAuthToken(token);
    next();
};
