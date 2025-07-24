import { z } from "zod";

export const commonValidations = {
  id: z
    .number({ coerce: true })
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  notEmptyString: z.string(),
  optionalString: z.string().optional(),
  isBinaryValue: z.union([z.literal(0), z.literal(1)]).optional(),
  optionalNumber: z.number().optional(),
};
