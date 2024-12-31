import { StatusCodes } from "http-status-codes";

import type { Category } from "@/api/category/categoryModel";
import { CategoryRepository } from "@/api/category/categoryRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Request, Response } from "express";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(repository: CategoryRepository = new CategoryRepository()) {
    this.categoryRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<Category[] | null>> {
    try {
      const users = await this.categoryRepository.findAllAsync();
      return ServiceResponse.success<Category[]>("Success", users);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async findById(req: Request, res: Response): Promise<ServiceResponse<Category | null>> {
    try {
      const user = await this.categoryRepository.findByIdAsync(req, res);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Category>("User found", user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${req.params.id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const categoryService = new CategoryService();
