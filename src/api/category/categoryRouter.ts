import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  CategorySchema,
  CreateCategorySchema,
  GetCategorySchema,
  UpdateCategorySchema,
} from "@/api/category/categoryModel";
import { authenticateToken } from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";
import { categoryController } from "./categoryController";

export const categoryRegistry = new OpenAPIRegistry();
export const categoryRouter: Router = express.Router();

//get list
categoryRegistry.register("Category", CategorySchema);

categoryRegistry.registerPath({
  method: "get",
  path: "/category",
  tags: ["Category"],
  responses: createApiResponse(z.array(CategorySchema), "Success"),
});

categoryRouter.get("/", categoryController.getCategories);

//get detail
categoryRegistry.registerPath({
  method: "get",
  path: "/category/{id}",
  tags: ["Category"],
  request: { params: GetCategorySchema.shape.params },
  responses: createApiResponse(CategorySchema, "Success"),
});

categoryRouter.get("/:id", validateRequest(GetCategorySchema), categoryController.getCategory);

//create
categoryRegistry.registerPath({
  method: "post",
  path: "/category",
  tags: ["Category"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": { schema: CreateCategorySchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CategorySchema, "Success"),
});

categoryRouter.post("/", authenticateToken, validateRequest(CreateCategorySchema), categoryController.createCategory);

//delete
categoryRegistry.registerPath({
  method: "delete",
  path: "/category/{id}",
  tags: ["Category"],
  security: [{ bearerAuth: [] }],
  request: { params: GetCategorySchema.shape.params },
  responses: {
    200: {
      description: "Category deleted successfully",
    },
    404: {
      description: "Category not found",
    },
  },
});

categoryRouter.delete("/:id", authenticateToken, validateRequest(GetCategorySchema), categoryController.deleteCategory);

//update
categoryRegistry.registerPath({
  method: "put",
  path: "/category/{id}",
  tags: ["Category"],
  security: [{ bearerAuth: [] }],
  request: {
    params: GetCategorySchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateCategorySchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CategorySchema, "Success"),
});

categoryRouter.put("/:id", authenticateToken, validateRequest(UpdateCategorySchema), categoryController.updateCategory);
