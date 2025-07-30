import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Store = z.infer<typeof StoreSchema>;

export const StoreSchema = z.object({
  id: commonValidations.id,
  code: commonValidations.notEmptyString,
  name: commonValidations.notEmptyString,
  address: commonValidations.notEmptyString,
  phone_number: z.string().min(10).max(15),
  is_deleted: commonValidations.isBinaryValue,
});
