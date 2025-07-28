import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authenticateToken } from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";
import { productController } from "./productController.admin";
import { CreateProductSchema, GetProductSchema, ProductSchema, UpdateProductSchema } from "./productModel.admin";

export const adminProductRegistry = new OpenAPIRegistry();
export const adminProductRouter: Router = express.Router();

//get list
adminProductRegistry.register("Admin Product", ProductSchema);

adminProductRegistry.registerPath({
  method: "get",
  path: "/admin/product",
  tags: ["Admin Product"],
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});

adminProductRouter.get("/", productController.getProducts);

//get detail
adminProductRegistry.registerPath({
  method: "get",
  path: "/admin/product/{id}",
  tags: ["Admin Product"],
  request: { params: GetProductSchema.shape.params },
  responses: createApiResponse(ProductSchema, "Success"),
});

adminProductRouter.get("/:id", validateRequest(GetProductSchema), productController.getProduct);

//create
adminProductRegistry.registerPath({
  method: "post",
  path: "/admin/product",
  tags: ["Admin Product"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": { schema: CreateProductSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(ProductSchema, "Success"),
});

adminProductRouter.post("/", authenticateToken, validateRequest(CreateProductSchema), productController.createProduct);

//delete
adminProductRegistry.registerPath({
  method: "delete",
  path: "/admin/product/{id}",
  tags: ["Admin Product"],
  security: [{ bearerAuth: [] }],
  request: { params: GetProductSchema.shape.params },
  responses: {
    200: {
      description: "Product deleted successfully",
    },
    404: {
      description: "Product not found",
    },
  },
});

adminProductRouter.delete(
  "/:id",
  authenticateToken,
  validateRequest(GetProductSchema),
  productController.deleteProduct,
);

//update
adminProductRegistry.registerPath({
  method: "put",
  path: "/admin/product/{id}",
  tags: ["Admin Product"],
  security: [{ bearerAuth: [] }],
  request: {
    params: GetProductSchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateProductSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(ProductSchema, "Success"),
});

adminProductRouter.put(
  "/:id",
  authenticateToken,
  validateRequest(UpdateProductSchema),
  productController.updateProduct,
);
