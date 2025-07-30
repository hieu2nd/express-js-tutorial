import { AccountSchema, CustomerSchema, UserSchema } from "@/common/utils/baseSchemas";
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

export const CustomerQueryRowSchema = z
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
    // Customer fields
    status: z.string(),
  })
  .openapi("CustomerQueryRow");

export type CustomerQueryRow = z.infer<typeof CustomerQueryRowSchema>;

// =============================================================================
// REQUEST BODY SCHEMAS
// =============================================================================

export const LoginRequestBodySchema = z
  .object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .openapi("LoginRequestBody");

export const CustomerRegistrationRequestBodySchema = z
  .object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email format"),
    phone_number: z.string().min(10).max(15),
    address: z.string().min(1, "Address is required"),
    dob: z.coerce.date().optional(),
    status: z.string().optional(),
  })
  .openapi("CustomerRegistrationRequestBody");

export const RefreshTokenRequestBodySchema = z
  .object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  })
  .openapi("RefreshTokenRequestBody");

// =============================================================================
// EXPRESS REQUEST SCHEMAS
// =============================================================================

export const CustomerAccountRequestSchema = z.object({
  body: z
    .object({
      username: z.string().min(6, "Username must be at least 6 characters"),
      password: z.string().min(6, "Password must be at least 6 characters"),
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
      CustomerSchema.omit({
        id: true,
        created_at: true,
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
      status: z.string(),
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
export type CustomerRegistrationRequestBody = z.infer<typeof CustomerRegistrationRequestBodySchema>;
export type RefreshTokenRequestBody = z.infer<typeof RefreshTokenRequestBodySchema>;

// Express request types
export type CustomerAccountRequest = z.infer<typeof CustomerAccountRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// Service response types
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type VerifyTokenResponse = z.infer<typeof VerifyTokenResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// JWT and utility types
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
