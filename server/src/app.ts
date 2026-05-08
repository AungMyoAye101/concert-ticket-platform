import "reflect-metadata";
import express from "express";
import cookiesParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

//all routes import here
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/global-error-middleware";
import { correlationMiddleware } from "./middlewares/correlation-middleware";
import { openApiSpec } from "./docs/openapi";
import { log } from "./utils/logger";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(cookiesParser());
app.use(express.json());
app.use(correlationMiddleware);
app.use((req, _res, next) => {
    log.info("Request received", { method: req.method, path: req.path });
    next();
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/api/v1", routes)
app.use(globalErrorHandler);

export default app;
