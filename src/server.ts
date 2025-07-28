import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { categoryRouter } from "@/api/client/category/categoryRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { adminCategoryRouter } from "./api/admin/category/categoryRouter.admin";
import { adminProductRouter } from "./api/admin/product/productRouter.admin";
import { authRouter } from "./api/client/auth/authRouter";
import { productRouter } from "./api/client/product/productRouter";
import { userRouter } from "./api/client/user/userRouter";
const logger = pino({ name: "server start" });
const app: Express = express();
// Set the application to trust the reverse proxy
app.set("trust proxy", true);
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/category", categoryRouter);
app.use("/admin/category", adminCategoryRouter);
app.use("/admin/product", adminProductRouter);
app.use("/product", productRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
