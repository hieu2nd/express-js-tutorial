import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  CreateProductSchema,
  GetProductSchema,
  ProductSchema,
  UpdateProductSchema,
} from "@/api/client/product/productModel";
import { authenticateToken, optionalAuth } from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";
import { productController } from "./productController";

export const productRegistry = new OpenAPIRegistry();
export const productRouter: Router = express.Router();

//get list
productRegistry.register("Product", ProductSchema);
productRegistry.registerPath({
  method: "get",
  path: "/product",
  tags: ["Product"],
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});

productRouter.get("/", optionalAuth, productController.getProducts);

//get detail
productRegistry.registerPath({
  method: "get",
  path: "/product/{id}",
  tags: ["Product"],
  request: { params: GetProductSchema.shape.params },
  responses: createApiResponse(ProductSchema, "Success"),
});

productRouter.get("/:id", optionalAuth, validateRequest(GetProductSchema), productController.getProduct);
//create

productRegistry.registerPath({
  method: "post",
  path: "/product",
  tags: ["Product"],
  request: {
    body: {
      content: {
        "application/json": { schema: CreateProductSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(ProductSchema, "Success"),
});

productRouter.post("/", authenticateToken, validateRequest(CreateProductSchema), productController.createProduct);

//delete
productRegistry.registerPath({
  method: "delete",
  path: "/product/{id}",
  tags: ["Product"],
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

productRouter.delete("/:id", authenticateToken, validateRequest(GetProductSchema), productController.deleteProduct);

//update
productRegistry.registerPath({
  method: "put",
  path: "/product/{id}",
  tags: ["Product"],
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

productRouter.put("/:id", authenticateToken, validateRequest(UpdateProductSchema), productController.updateProduct);
