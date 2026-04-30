import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../common/errors/http-errors";


export const validate =
    (schema: ZodSchema) =>
        (req: Request, _res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                throw new BadRequestError(result.error.message);
            }

            req.body = result.data;
            next();
        };