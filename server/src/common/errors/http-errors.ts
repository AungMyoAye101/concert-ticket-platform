import { AppError } from ".";

export class NotFoundError extends AppError {
    statusCode = 404;
    constructor(public message: string) {
        super(message);
    }
    generateError() {
        return [{ message: this.message }];
    }
}

export class BadRequestError extends AppError {
    statusCode = 400;
    constructor(public message: string) {
        super(message);
    }
    generateError() {
        return [{ message: this.message }];
    }
}

export class UnauthorizedError extends AppError {
    statusCode = 401;
    constructor(public message: string) {
        super(message);
    }
    generateError() {
        return [{ message: this.message }];
    }
}
export class ForbiddenError extends AppError {
    statusCode = 403;
    constructor(public message: string) {
        super(message);
    }
    generateError() {
        return [{ message: this.message }];
    }
}

export class InternalServerError extends AppError {
    statusCode = 500;
    constructor(public message: string) {
        super(message);
    }
    generateError() {
        return [{ message: this.message }];
    }
}

export class ConflictError extends AppError {
    statusCode = 409;
    constructor(public message: string) {
        super(message);
    }
    generateError() {
        return [{ message: this.message }];
    }
};
