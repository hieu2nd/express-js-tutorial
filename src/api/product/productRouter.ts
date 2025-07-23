import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateProductSchema, GetProductSchema, ProductSchema, UpdateProductSchema } from "@/api/product/productModel";
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
productRouter.get("/", productController.getCategories);
//get detail
productRegistry.registerPath({
  method: "get",
  path: "/product/{id}",
  tags: ["Product"],
  request: { params: GetProductSchema.shape.params },
  responses: createApiResponse(ProductSchema, "Success"),
});
productRouter.get("/:id", validateRequest(GetProductSchema), productController.getCategory);
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
productRouter.post("/", validateRequest(CreateProductSchema), productController.createProduct);
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
productRouter.delete("/:id", validateRequest(GetProductSchema), productController.deleteCategory);
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
productRouter.put("/:id", validateRequest(UpdateProductSchema), productController.updateCategory);
