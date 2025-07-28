import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryPayload = z.infer<typeof CreateCategorySchema.shape.body>;
export type UpdateCategoryPayload = z.infer<typeof UpdateCategorySchema.shape.body>;
export type CategoryParams = z.infer<typeof GetCategorySchema.shape.params>;
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  is_deleted: z.number(),
  image_url: z.string(),
});

export const GetCategorySchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
export const CreateCategorySchema = z.object({
  body: CategorySchema.omit({
    id: true,
    is_deleted: true,
  }),
});
export const UpdateCategorySchema = z.object({
  body: CategorySchema.omit({
    id: true,
    is_deleted: true,
  })
    .partial()
    .extend({
      is_shown: commonValidations.isBinaryValue,
    }),
  params: z.object({ id: commonValidations.id }),
});
