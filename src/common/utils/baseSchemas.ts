import { z } from "zod";

// Base schemas for common fields
export const BaseEntitySchema = z.object({
  id: z.number().int().positive(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  is_deleted: z.boolean().default(false),
});

// Account Schema
export const AccountSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1).max(255).optional(),
  password: z.string().min(1).max(255).optional(),
  is_active: z.number().int().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  is_deleted: z.boolean().default(false),
  role_id: z.number(),
});

// User Schema
export const UserSchema = z.object({
  id: z.number().int().positive(),
  full_name: z.string().min(1).max(255).optional(),
  phone_number: z.string().max(255).optional(),
  email: z.string().email().max(255).optional(),
  address: z.string().max(255).optional(),
  dob: z.coerce.date().optional(),
  is_deleted: z.boolean().default(false),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Employee Schema
export const EmployeeSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1).max(255),
  store_id: z.number().int().positive().optional(),
});

// Customer Schema
export const CustomerSchema = z.object({
  id: z.number().int().positive(),
  status: z.string().max(255).optional(),
  created_at: z.date().optional(),
});

// Category Schema
export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255).optional(),
  is_deleted: z.boolean().default(false),
  image_url: z.string().url().max(255).optional(),
  is_shown: z.boolean().default(true),
});

// Product Schema
export const ProductSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1).max(255).optional(),
  name: z.string().min(1).max(255).optional(),
  image_url: z.string().url().max(255).optional(),
  price: z.number().nonnegative().optional(),
  unit: z.string().max(255).optional(),
  description: z.string().max(255).optional(),
  rating: z.number().int().min(0).max(5).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  is_deleted: z.boolean().default(false),
  is_shown: z.boolean().default(true),
  promotion_id: z.number().int().positive().optional(),
});

// Order Schema
export const OrderSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1).max(255).optional(),
  customer_id: z.number().int().positive().optional(),
  employee_id: z.number().int().positive().optional(),
  status: z.number().int().optional(),
  shipment_id: z.number().int().positive().optional(),
  total_money: z.number().nonnegative().optional(),
  created_at: z.date().optional(),
  reason: z.string().max(255).optional(),
  money_paid: z.number().int().nonnegative().optional(),
  number: z.number().int().optional(),
  is_deleted: z.boolean().default(false),
});

// Cart Schema
export const CartSchema = z.object({
  id: z.number().int().positive(),
  customer_id: z.number().int().positive().optional(),
  product_id: z.number().int().positive().optional(),
});

// Order History Schema
export const OrderHistorySchema = z.object({
  id: z.number().int().positive(),
  order_id: z.number().int().positive().optional(),
  action: z.string().max(255).optional(),
  money_paid: z.number().int().nonnegative().optional(),
  created_at: z.number().int().optional(), // long type in SQL
  created_by: z.string().max(255).optional(),
  last_updated_at: z.number().int().optional(), // long type in SQL
  last_updated_by: z.string().max(255).optional(),
});

// Promotion Schema
export const PromotionSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().max(255).optional(),
  start_day: z.date().optional(),
  end_day: z.date().optional(),
  discount_percent: z.number().min(0).max(100).optional(),
  money_deducted: z.number().int().nonnegative().optional(),
  number: z.number().int().optional(),
  is_deleted: z.boolean().default(false),
  coin: z.number().int().nonnegative().optional(),
});

// Store Schema
export const StoreSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1).max(255).optional(),
  name: z.string().min(1).max(255).optional(),
  is_deleted: z.boolean().default(false),
  phone_number: z.string().max(255).optional(),
  address: z.string().max(255).optional(),
});

// Shipment Schema
export const ShipmentSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().max(255).optional(),
  name: z.string().max(255).optional(),
  price: z.number().nonnegative().optional(),
  method: z.string().max(255).optional(),
  store_id: z.number().int().positive().optional(),
});

// Role Schema
export const RoleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  permissions: z.record(z.any()).optional(), // JSON field for permissions
  is_active: z.number().int().min(0).max(1).default(1), // TINYINT(1) for boolean
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Type exports for TypeScript usage
export type Account = z.infer<typeof AccountSchema>;
export type User = z.infer<typeof UserSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type OrderHistory = z.infer<typeof OrderHistorySchema>;
export type Promotion = z.infer<typeof PromotionSchema>;
export type Store = z.infer<typeof StoreSchema>;
export type Shipment = z.infer<typeof ShipmentSchema>;
export type Role = z.infer<typeof RoleSchema>;
