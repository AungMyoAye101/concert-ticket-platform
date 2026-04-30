import { Request, Response } from "express";
import { successResponse } from "../common/success-response";
import { createUser, getAllUsers, getUserById } from "../services/user-service";

const mapUserResponse = (user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
});

export const createUserController = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await createUser(name, email, password);

    return successResponse(res, 201, "User created", mapUserResponse(user));
};

export const getUsersController = async (_req: Request, res: Response) => {
    const users = await getAllUsers();

    return successResponse(
        res,
        200,
        "User list fetched",
        users.map(mapUserResponse),
    );
};

export const getUserByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getUserById(id);

    return successResponse(res, 200, "User fetched", mapUserResponse(user));
};
