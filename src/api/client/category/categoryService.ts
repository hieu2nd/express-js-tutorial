import { StatusCodes } from "http-status-codes";

import type { Category } from "@/api/client/category/categoryModel";
import { CategoryRepository } from "@/api/client/category/categoryRepository";
import type { ApiOptions } from "@/common/models/common";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(repository: CategoryRepository = new CategoryRepository()) {
    this.categoryRepository = repository;
  }

  async findAll({ isAdmin }: ApiOptions): Promise<ServiceResponse<Category[] | null>> {
    try {
      const categories = await this.categoryRepository.findAll();
      return ServiceResponse.success<Category[]>("Success", categories);
    } catch (ex) {
      const errorMessage = `Error finding all categories: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const categoryService = new CategoryService();
