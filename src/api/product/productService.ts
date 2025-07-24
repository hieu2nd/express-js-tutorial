import { StatusCodes } from "http-status-codes";

import type { Category, UpdateCategoryPayload } from "@/api/category/categoryModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Request, Response } from "express";
import { CreateProductPayload, type Product, UpdateProductPayload } from "./productModel";
import { ProductRepository } from "./productRepository";

export class ProductService {
  private productRepository: ProductRepository;

  constructor(repository: ProductRepository = new ProductRepository()) {
    this.productRepository = repository;
  }

  async findAll(): Promise<ServiceResponse<Product[] | null>> {
    try {
      const products = await this.productRepository.findAllAsync();
      return ServiceResponse.success<Product[]>("Success", products);
    } catch (ex) {
      const errorMessage = `Error finding all products: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async findById(req: Request, res: Response): Promise<ServiceResponse<Product | null>> {
    try {
      const product = await this.productRepository.findByIdAsync(req, res);
      if (!product) {
        return ServiceResponse.failure("Product not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Product>("Product found", product);
    } catch (ex) {
      const errorMessage = `Error finding product with id ${req.params.id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding product.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async create(req: Request): Promise<ServiceResponse<Product | null>> {
    try {
      const product = await this.productRepository.createAsync(req);
      if (!product) return ServiceResponse.failure("Failed to create product", null, StatusCodes.BAD_REQUEST);
      return ServiceResponse.success<Product>("Product created", product);
    } catch (ex) {
      const errorMessage = `Error creating product, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating product.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async delete(req: Request): Promise<ServiceResponse<Record<string, never>>> {
    try {
      await this.productRepository.deleteAsync(req);
      return ServiceResponse.success<Record<string, never>>("Category deleted", {});
    } catch (ex) {
      const errorMessage = `Error deleting category, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding category.",
        {},
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(req: Request): Promise<ServiceResponse<Product | null>> {
    try {
      const product = await this.productRepository.updateAsync(req);
      if (!product) return ServiceResponse.failure("Failed to update product", null, StatusCodes.BAD_REQUEST);
      return ServiceResponse.success<Product>("Product updated", product);
    } catch (ex) {
      const errorMessage = `Error updating product, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating product.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const productService = new ProductService();
