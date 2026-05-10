import { Request, Response } from "express";
import { successResponse } from "../common/success-response";
import { loginUser } from "../services/auth-service";

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const auth = await loginUser(email, password);

    return successResponse(res, 200, "Login successful", auth);
};

export const logoutController = async (_req: Request, res: Response) => {
    return successResponse(res, 200, "Logout successful");
};

export const meController = async (req: Request, res: Response) => {
    return successResponse(res, 200, "Current user fetched", req.currentUser);
};
