import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Product = z.infer<typeof ProductSchema>;
export type ProductParams = z.infer<typeof GetProductSchema.shape.params>;
export const ProductSchema = z.object({
  id: commonValidations.id,
  code: commonValidations.notEmptyString,
  name: commonValidations.notEmptyString,
  image_url: commonValidations.optionalString,
  price: z.number(),
  unit: commonValidations.notEmptyString,
  description: commonValidations.optionalString,
  rating: commonValidations.optionalNumber,
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
  is_deleted: commonValidations.isBinaryValue,
  promotion_id: commonValidations.id.optional(),
});
export const GetProductSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
