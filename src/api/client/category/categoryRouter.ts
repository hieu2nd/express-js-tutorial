import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CategorySchema } from "@/api/client/category/categoryModel";
import { categoryController } from "./categoryController";

export const categoryRegistry = new OpenAPIRegistry();
export const categoryRouter: Router = express.Router();

//get list
categoryRegistry.register("Category", CategorySchema);

categoryRegistry.registerPath({
  method: "get",
  path: "/category",
  tags: ["Client Category"],
  responses: createApiResponse(z.array(CategorySchema), "Success"),
});

categoryRouter.get("/", categoryController.getCategories);
