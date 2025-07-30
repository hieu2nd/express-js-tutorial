import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Store } from "./storeModel.admin";
import { StoreRepository } from "./storeRepository.admin";

export class StoreService {
  private storeRepository: StoreRepository;

  constructor(repository: StoreRepository = new StoreRepository()) {
    this.storeRepository = repository;
  }

  async findAll(): Promise<ServiceResponse<Store[] | null>> {
    try {
      const stores = await this.storeRepository.findAllAsync();
      return ServiceResponse.success<Store[]>("Success", stores);
    } catch (ex) {
      const errorMessage = `Error finding all stores: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const storeService = new StoreService();
