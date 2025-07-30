import Database from "@/database";
import { logger } from "@/server";
import type { Pool } from "mysql2/promise";
import type { Store } from "./storeModel.admin";

interface IStoreRepository {
  findAllAsync(): Promise<Store[]>;
}

export class StoreRepository implements IStoreRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }

  async findAllAsync(): Promise<Store[]> {
    try {
      const [rows] = await this.connection.query("SELECT * FROM store WHERE is_deleted = 0");
      return rows as Store[];
    } catch (error) {
      logger.error("Error in findAllAsync:", error);
      return [];
    }
  }
}
