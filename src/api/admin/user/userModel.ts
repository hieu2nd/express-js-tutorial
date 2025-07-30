import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;
export type EmployeeResponse = z.infer<typeof EmployeeResponseSchema>;

export const UserSchema = z
  .object({
    id: z.number(),
    full_name: z.string(),
    email: z.string().email(),
    phone_number: z.string().min(10).max(15),
    address: z.string(),
    is_deleted: commonValidations.isBinaryValue,
    dob: z.coerce.date().optional(),
    updated_at: z.date(),
    created_at: z.date(),
  })
  .extend({
    is_active: commonValidations.isBinaryValue,
    password: z.string(),
    username: z.string(),
  })
  .openapi("User");

// Employee inherits from User and adds employee-specific fields
export const EmployeeSchema = UserSchema.extend({
  code: z.string(),
  store: z.object({
    store_id: z.number(),
    code: z.string(),
    phone_number: z.string(),
    address: z.string(),
  }),
}).openapi("Employee");

// EmployeeResponse - Safe for API responses (password excluded)
export const EmployeeResponseSchema = EmployeeSchema.omit({
  password: true, // ← Password is NOT included in API responses
  updated_at: true, // ← Internal timestamps excluded
  created_at: true, // ← Internal timestamps excluded
}).openapi("EmployeeResponse");

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
