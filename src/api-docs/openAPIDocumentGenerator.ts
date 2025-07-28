import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { adminCategoryRegistry } from "@/api/admin/category/categoryRouter.admin";
import { adminProductRegistry } from "@/api/admin/product/productRouter.admin";
import { authRegistry } from "@/api/client/auth/authRouter";
import { categoryRegistry } from "@/api/client/category/categoryRouter";
import { productRegistry } from "@/api/client/product/productRouter";
import { userRegistry } from "@/api/client/user/userRouter";
import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    authRegistry,
    userRegistry,
    categoryRegistry,
    productRegistry,
    adminCategoryRegistry,
    adminProductRegistry,
  ]);

  // Register Bearer token security scheme
  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter your JWT token",
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
