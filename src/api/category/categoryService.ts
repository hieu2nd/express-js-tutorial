import { StatusCodes } from "http-status-codes";

import type {
  Category,
  CategoryParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/api/category/categoryModel";
import { CategoryRepository } from "@/api/category/categoryRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Request, Response } from "express";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(repository: CategoryRepository = new CategoryRepository()) {
    this.categoryRepository = repository;
  }

  async findAll(): Promise<ServiceResponse<Category[] | null>> {
    try {
      const categories = await this.categoryRepository.findAllAsync();
      return ServiceResponse.success<Category[]>("Success", categories);
    } catch (ex) {
      const errorMessage = `Error finding all categories: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async findById(req: Request, res: Response): Promise<ServiceResponse<Category | null>> {
    try {
      const category = await this.categoryRepository.findByIdAsync(req, res);
      if (!category) {
        return ServiceResponse.failure("Category not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Category>("Category found", category);
    } catch (ex) {
      const errorMessage = `Error finding category with id ${req.params.id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding category.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async create(req: Request<any, any, CreateCategoryPayload>): Promise<ServiceResponse<Category | null>> {
    try {
      const category = await this.categoryRepository.createAsync(req);
      if (!category) return ServiceResponse.failure("Failed to create category", null, StatusCodes.BAD_REQUEST);
      return ServiceResponse.success<Category>("Category created", category);
    } catch (ex) {
      const errorMessage = `Error creating category, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding category.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async delete(req: Request): Promise<ServiceResponse<any>> {
    try {
      await this.categoryRepository.deleteAsync(req);
      return ServiceResponse.success<any>("Category deleted", {});
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
  async update(req: Request<any, any, UpdateCategoryPayload>): Promise<ServiceResponse<Category | null>> {
    try {
      const category = await this.categoryRepository.updateAsync(req);
      if (!category) return ServiceResponse.failure("Failed to update category", null, StatusCodes.BAD_REQUEST);
      return ServiceResponse.success<Category>("Category created", category);
    } catch (ex) {
      const errorMessage = `Error updating category, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding category.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const categoryService = new CategoryService();
