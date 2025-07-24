import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Product = z.infer<typeof ProductSchema>;
export type CreateProductPayload = z.infer<typeof CreateProductSchema.shape.body>;
export type UpdateProductPayload = z.infer<typeof UpdateProductSchema.shape.body>;
export type ProductParams = z.infer<typeof GetProductSchema.shape.params>;
export const ProductSchema = z.object({
  id: commonValidations.id,
  code: commonValidations.notEmptyString,
  name: commonValidations.notEmptyString,
  price: z.number(),
  unit: commonValidations.notEmptyString,
  description: commonValidations.optionalString,
  rating: commonValidations.optionalNumber,
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
  is_deleted: commonValidations.isBinaryValue,
  promotion_id: commonValidations.id.optional(),
});
export const CreateProductSchema = z.object({
  body: ProductSchema.extend({ category_id: commonValidations.id }).omit({
    id: true,
    created_at: true,
    updated_at: true,
    is_deleted: true,
  }),
});
export const GetProductSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
export const UpdateProductSchema = z.object({
  body: z.object({
    name: commonValidations.optionalString,
    image_url: commonValidations.optionalString,
    is_shown: commonValidations.isBinaryValue,
  }),
  params: z.object({ id: commonValidations.id }),
});
