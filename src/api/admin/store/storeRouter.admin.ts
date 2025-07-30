import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { storeController } from "./storeController.admin";
import { StoreSchema } from "./storeModel.admin";

export const adminStoreRegistry = new OpenAPIRegistry();
export const adminStoreRouter: Router = express.Router();

//get list
adminStoreRegistry.register("Admin Store", StoreSchema);

adminStoreRegistry.registerPath({
  method: "get",
  path: "/admin/store",
  tags: ["Admin Store"],
  responses: createApiResponse(z.array(StoreSchema), "Success"),
});

adminStoreRouter.get("/", storeController.getStores);
