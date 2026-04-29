import { Router } from "express";
import { getAllConcertsController } from "../controllers/concert-controller";

const route = Router();

//get all concerts
route.get("/", getAllConcertsController);

export default route;