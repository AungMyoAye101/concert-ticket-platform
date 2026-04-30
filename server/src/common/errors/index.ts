export abstract class AppError extends Error {
    abstract statusCode: number;


    constructor(message: string) {
        super(message);
    }
    abstract generateError(): {
        message: string;
        fileds?: string[]
    }[]

}