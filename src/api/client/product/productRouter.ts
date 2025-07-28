import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetProductSchema, ProductSchema } from "@/api/client/product/productModel";
import { optionalAuth } from "@/common/middleware/authMiddleware";
import { productController } from "./productController";

export const productRegistry = new OpenAPIRegistry();
export const productRouter: Router = express.Router();

//get list
productRegistry.register("Client Product", ProductSchema);
productRegistry.registerPath({
  method: "get",
  path: "/product",
  tags: ["Client Product"],
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});

productRouter.get("/", optionalAuth, productController.getProducts);

//get detail
productRegistry.registerPath({
  method: "get",
  path: "/product/{id}",
  tags: ["Client Product"],
  request: { params: GetProductSchema.shape.params },
  responses: createApiResponse(ProductSchema, "Success"),
});
