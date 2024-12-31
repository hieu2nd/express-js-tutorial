import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CategorySchema, GetCategorySchema } from "@/api/category/categoryModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { categoryController } from "./categoryController";

export const categoryRegistry = new OpenAPIRegistry();
export const categoryRouter: Router = express.Router();

categoryRegistry.register("Category", CategorySchema);

categoryRegistry.registerPath({
  method: "get",
  path: "/category",
  tags: ["Category"],
  responses: createApiResponse(z.array(CategorySchema), "Success"),
});

categoryRouter.get("/", categoryController.getCategories);

categoryRegistry.registerPath({
  method: "get",
  path: "/category/{id}",
  tags: ["Category"],
  request: { params: GetCategorySchema.shape.params },
  responses: createApiResponse(CategorySchema, "Success"),
});

categoryRouter.get("/:id", validateRequest(GetCategorySchema), categoryController.getCategory);
