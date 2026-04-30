import { Router } from "express";
import { successResponse } from "../common/success-response";

const route = Router();

route.get("/", (_req, res) => {
    successResponse(res, 200, "Server is healthy");
});

export default route;