import { Request, Response } from "express";
import { successResponse } from "../common/success-response";
import { getAllUsers, getUserById } from "../services/user-service";

export const mapUserResponse = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

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
  const id = String(req.params.id);
  const user = await getUserById(id);

  return successResponse(res, 200, "User fetched", mapUserResponse(user));
};
