import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "./authController";
import {
  CustomerAccountRequestSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  RefreshTokenRequestBodySchema,
  RefreshTokenResponseSchema,
  VerifyTokenResponseSchema,
} from "./authModel";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", z.object({}));

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(LoginResponseSchema, "Login successful"),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CustomerAccountRequestSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(LoginResponseSchema, "Registration successful"),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RefreshTokenRequestBodySchema,
        },
      },
    },
  },
  responses: createApiResponse(RefreshTokenResponseSchema, "Token refreshed successfully"),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/verify",
  tags: ["Auth"],
  request: {
    headers: z.object({
      authorization: z.string(),
    }),
  },
  responses: createApiResponse(VerifyTokenResponseSchema, "Token verified successfully"),
});

authRouter.post("/login", validateRequest(LoginRequestSchema), authController.login);
authRouter.post("/register", validateRequest(CustomerAccountRequestSchema), authController.registerCustomer);
authRouter.post(
  "/refresh",
  validateRequest(z.object({ body: RefreshTokenRequestBodySchema })),
  authController.refreshToken,
);
authRouter.post("/verify", authController.verifyToken);
