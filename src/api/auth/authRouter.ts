import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authController } from "@/api/auth/authController";
import { CustomerAccountSchema, LoginRequestSchema, RefreshTokenSchema } from "@/api/auth/authModel";
import { validateRequest } from "@/common/utils/httpHandlers";

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
  responses: createApiResponse(
    z.object({
      token: z.string(),
      user: z.object({
        id: z.number(),
        username: z.string(),
        full_name: z.string(),
        email: z.string(),
      }),
    }),
    "Login successful",
  ),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CustomerAccountSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(
    z.object({
      token: z.string(),
      user: z.object({
        id: z.number(),
        username: z.string(),
        full_name: z.string(),
        email: z.string(),
      }),
    }),
    "Registration successful",
  ),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RefreshTokenSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(
    z.object({
      accessToken: z.string(),
    }),
    "Token refreshed successfully",
  ),
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
  responses: createApiResponse(
    z.object({
      userId: z.number(),
      username: z.string(),
    }),
    "Token verified successfully",
  ),
});

authRouter.post("/login", validateRequest(LoginRequestSchema), authController.login);
authRouter.post("/register", validateRequest(CustomerAccountSchema), authController.registerCustomer);
authRouter.post("/refresh", validateRequest(RefreshTokenSchema), authController.refreshToken);
authRouter.post("/verify", authController.verifyToken);
