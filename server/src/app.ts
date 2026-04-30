import "reflect-metadata";
import express from "express";
import cookiesParser from "cookie-parser";

//all routes import here
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/global-error-middleware";

const app = express();

// Middlewares
app.use(cookiesParser());
app.use(express.json());


//routes 


app.use("/api/v1", routes)
app.use(globalErrorHandler);

export default app;