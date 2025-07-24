import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CustomerSchema } from "../user/userModel";

extendZodWithOpenApi(z);

export type CustomerAccountRequest = z.infer<typeof CustomerAccountSchema>;
export const CustomerAccountSchema = z.object({
  body: z
    .object({
      username: z.string(),
      password: z.string(),
    })
    .extend(
      CustomerSchema.omit({
        id: true,
        is_deleted: true,
        updated_at: true,
        created_at: true,
        status: true,
        is_active: true,
      }).shape,
    ),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export const LoginRequestSchema = z.object({
  body: z.object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 8 characters"),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    full_name: z.string(),
    email: z.string(),
  }),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

// Input Validation for refresh token endpoint
export const RefreshTokenSchema = z.object({
  body: RefreshTokenRequestSchema,
});

// JWT Payload interface
export interface JwtPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}
