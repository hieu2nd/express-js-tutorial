import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Category = z.infer<typeof CategorySchema>;
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  is_deleted: z.number(),
  image_url: z.string(),
});
