import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authenticateAdminToken } from "@/common/middleware/adminAuthMiddleware";
import { validateBody, validateSchema } from "@/common/utils/httpHandlers";
import { adminAuthController } from "./authController.admin";
import {
  EmployeeRegistrationRequestBodySchema,
  LoginRequestBodySchema,
  LoginResponseSchema,
  ValidateAuthHeaderSchema,
} from "./authModel.admin";

export const adminAuthRegistry = new OpenAPIRegistry();
export const adminAuthRouter: Router = express.Router();

adminAuthRegistry.register("Admin Auth", z.object({}));

adminAuthRegistry.registerPath({
  method: "post",
  path: "/admin/auth/login",
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

// Routes with enhanced validation
adminAuthRouter.post("/login", validateBody(LoginRequestBodySchema), adminAuthController.login);

adminAuthRouter.post("/register", validateBody(EmployeeRegistrationRequestBodySchema), adminAuthController.register);

adminAuthRouter.post(
  "/verify",
  authenticateAdminToken,
  validateSchema(ValidateAuthHeaderSchema),
  adminAuthController.verifyToken,
);
