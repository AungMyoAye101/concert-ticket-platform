import { AuthUser } from "../services/auth-service";

declare global {
    namespace Express {
        interface Request {
            currentUser?: AuthUser;
        }
    }
}

export {};
