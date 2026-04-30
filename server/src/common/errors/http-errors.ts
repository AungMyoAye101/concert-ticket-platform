import { AppError } from ".";

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message = "Not Found");
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(400, message = "Bad Request");
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(401, message = "Unauthorized");
    }
}
export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(403, message = "Forbidden");
    }
}

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(500, message = "Internal Server Error");
    }
}