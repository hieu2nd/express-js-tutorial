import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;

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
  });

// Customer inherits from User and adds customer-specific fields
export const CustomerSchema = UserSchema.extend({
  username: z.string(),
  status: z.string(),
  is_active: commonValidations.isBinaryValue,
});

// Employee inherits from User and adds employee-specific fields
export const EmployeeSchema = UserSchema.extend({
  code: z.string(),
  store_id: z.number(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
