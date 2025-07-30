import { AccountSchema, EmployeeSchema, UserSchema } from "@/common/utils/baseSchemas";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// =============================================================================
// EXTENDED SCHEMAS FOR JOINED QUERIES
// =============================================================================

export const UserAccountSchema = UserSchema.merge(
  AccountSchema.pick({
    username: true,
    password: true,
    is_active: true,
  }),
).openapi("UserAccount");

// =============================================================================
// DATABASE QUERY ROW SCHEMAS (Raw database results)
// =============================================================================

export const EmployeeQueryRowSchema = z
  .object({
    // Account fields
    id: z.number(),
    username: z.string(),
    password: z.string(),
    is_active: z.number(),
    is_deleted: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
    // User fields
    full_name: z.string(),
    email: z.string().email(),
    phone_number: z.string(),
    address: z.string(),
    dob: z.date().nullable(),
    // Employee fields
    code: z.string(),
    store_id: z.number(),
    // Store fields (aliased)
    store_code: z.string(),
    store_name: z.string(),
    store_phone_number: z.string(),
    store_address: z.string(),
    store_is_deleted: z.number(),
  })
  .openapi("EmployeeQueryRow");

export type EmployeeQueryRow = z.infer<typeof EmployeeQueryRowSchema>;

// =============================================================================
// REQUEST BODY SCHEMAS
// =============================================================================

export const LoginRequestBodySchema = z
  .object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .openapi("LoginRequestBody");

export const EmployeeRegistrationRequestBodySchema = z
  .object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    store_id: z.number().positive("Store ID must be a positive number"),
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email format"),
    phone_number: z.string().min(10).max(15),
    address: z.string().min(1, "Address is required"),
    dob: z.coerce.date().optional(),
    code: z.string().min(1, "Employee code is required"),
  })
  .openapi("EmployeeRegistrationRequestBody");

export const RefreshTokenRequestBodySchema = z
  .object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  })
  .openapi("RefreshTokenRequestBody");

// =============================================================================
// EXPRESS REQUEST SCHEMAS
// =============================================================================

export const EmployeeAccountRequestSchema = z.object({
  body: z
    .object({
      username: z.string().min(6, "Username must be at least 6 characters"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      store_id: z.number(),
    })
    .extend(
      UserSchema.omit({
        id: true,
        is_deleted: true,
        created_at: true,
        updated_at: true,
      }).shape,
    )
    .extend(
      EmployeeSchema.omit({
        id: true,
        store_id: true,
      }).shape,
    ),
});

export const LoginRequestSchema = z.object({
  body: z.object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// =============================================================================
// RESPONSE SCHEMAS
// =============================================================================

export const LoginResponseSchema = z
  .object({
    token: z.string(),
    user: z.object({
      id: z.number(),
      username: z.string(),
      full_name: z.string(),
      email: z.string().email(),
      phone_number: z.string(),
      address: z.string(),
      code: z.string(),
      store: z.object({
        store_id: z.number(),
        code: z.string(),
        phone_number: z.string(),
        address: z.string(),
      }),
    }),
  })
  .openapi("AuthServiceLoginResponse");

export const VerifyTokenResponseSchema = z
  .object({
    userId: z.number(),
    username: z.string(),
    iat: z.number().optional(),
    exp: z.number().optional(),
  })
  .openapi("AuthServiceVerifyTokenResponse");

export const RefreshTokenResponseSchema = z
  .object({
    accessToken: z.string(),
  })
  .openapi("AuthServiceRefreshTokenResponse");

// =============================================================================
// JWT AND VALIDATION SCHEMAS
// =============================================================================

export const JwtPayloadSchema = z
  .object({
    userId: z.number(),
    username: z.string(),
    iat: z.number().optional(),
    exp: z.number().optional(),
  })
  .openapi("JwtPayload");

export const ValidateAuthHeaderSchema = z.object({
  headers: z.object({
    authorization: z.string().min(1, "Authorization header is required"),
  }),
});

// =============================================================================
// INFERRED TYPES
// =============================================================================

// Request body types
export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>;
export type EmployeeRegistrationRequestBody = z.infer<typeof EmployeeRegistrationRequestBodySchema>;
export type RefreshTokenRequestBody = z.infer<typeof RefreshTokenRequestBodySchema>;

// Express request types
export type EmployeeAccountRequest = z.infer<typeof EmployeeAccountRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// Service response types
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type VerifyTokenResponse = z.infer<typeof VerifyTokenResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// JWT and utility types
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
