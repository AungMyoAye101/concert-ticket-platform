import express from "express";
import cookiesParser from "cookie-parser";

//all routes import here
import healthRoute from "./routes/health-route";
const app = express();

// Middlewares
app.use(cookiesParser());
app.use(express.json());

//routes 
app.use("/api/v1", healthRoute);


export default app;