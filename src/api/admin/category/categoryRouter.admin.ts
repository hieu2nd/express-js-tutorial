import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CategorySchema } from "@/api/client/category/categoryModel";
import { authenticateToken } from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";
import { categoryController } from "./categoryController.admin";
import { CreateCategorySchema, GetCategorySchema, UpdateCategorySchema } from "./categoryModel.admin";

export const adminCategoryRegistry = new OpenAPIRegistry();
export const adminCategoryRouter: Router = express.Router();

//get list
adminCategoryRegistry.register("Admin Category", CategorySchema);

adminCategoryRegistry.registerPath({
  method: "get",
  path: "/admin/category",
  tags: ["Admin Category"],
  responses: createApiResponse(z.array(CategorySchema), "Success"),
});

adminCategoryRouter.get("/", categoryController.getCategories);

//get detail
adminCategoryRegistry.registerPath({
  method: "get",
  path: "/admin/category/{id}",
  tags: ["Admin Category"],
  request: { params: GetCategorySchema.shape.params },
  responses: createApiResponse(CategorySchema, "Success"),
});

adminCategoryRouter.get("/:id", validateRequest(GetCategorySchema), categoryController.getCategory);

//create
adminCategoryRegistry.registerPath({
  method: "post",
  path: "/admin/category",
  tags: ["Admin Category"],
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

adminCategoryRouter.post(
  "/",
  authenticateToken,
  validateRequest(CreateCategorySchema),
  categoryController.createCategory,
);

//delete
adminCategoryRegistry.registerPath({
  method: "delete",
  path: "/admin/category/{id}",
  tags: ["Admin Category"],
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

adminCategoryRouter.delete(
  "/:id",
  authenticateToken,
  validateRequest(GetCategorySchema),
  categoryController.deleteCategory,
);

//update
adminCategoryRegistry.registerPath({
  method: "put",
  path: "/admin/category/{id}",
  tags: ["Admin Category"],
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

adminCategoryRouter.put(
  "/:id",
  authenticateToken,
  validateRequest(UpdateCategorySchema),
  categoryController.updateCategory,
);
