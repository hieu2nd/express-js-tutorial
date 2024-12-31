import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Category = z.infer<typeof CategorySchema>;
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  is_deleted: z.number(),
  image_url: z.string(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetCategorySchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
