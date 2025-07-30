import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateBody, validateSchema } from "@/common/utils/httpHandlers";
import { adminAuthController } from "./authController";
import {
  EmployeeRegistrationRequestBodySchema,
  LoginRequestBodySchema,
  LoginResponseSchema,
  RefreshTokenRequestBodySchema,
  RefreshTokenResponseSchema,
  ValidateAuthHeaderSchema,
  VerifyTokenResponseSchema,
} from "./authModel";

export const adminAuthRegistry = new OpenAPIRegistry();
export const adminAuthRouter: Router = express.Router();

adminAuthRegistry.register("Admin Auth", z.object({}));

adminAuthRegistry.registerPath({
  method: "post",
  path: "admin/auth/login",
  tags: ["Admin Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestBodySchema,
        },
      },
    },
  },
  responses: createApiResponse(LoginResponseSchema, "Login successful"),
});

adminAuthRegistry.registerPath({
  method: "post",
  path: "/admin/auth/register",
  tags: ["Admin Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: EmployeeRegistrationRequestBodySchema,
        },
      },
    },
  },
  responses: createApiResponse(LoginResponseSchema, "Registration successful"),
});

adminAuthRegistry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Admin Auth"],
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

adminAuthRegistry.registerPath({
  method: "post",
  path: "/auth/verify",
  tags: ["Admin Auth"],
  request: {
    headers: z.object({
      authorization: z.string(),
    }),
  },
  responses: createApiResponse(VerifyTokenResponseSchema, "Token verified successfully"),
});

// Routes with enhanced validation
adminAuthRouter.post("/login", validateBody(LoginRequestBodySchema), adminAuthController.login);

adminAuthRouter.post(
  "/register",
  validateBody(EmployeeRegistrationRequestBodySchema),
  adminAuthController.registerEmployee,
);

adminAuthRouter.post("/refresh", validateBody(RefreshTokenRequestBodySchema), adminAuthController.refreshToken);

adminAuthRouter.post("/verify", validateSchema(ValidateAuthHeaderSchema), adminAuthController.verifyToken);
