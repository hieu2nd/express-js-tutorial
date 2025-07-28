import Database from "@/database";
import type { Pool } from "mysql2/promise";
import type { Category } from "./categoryModel";

interface ICategoryRepository {
  findAll(): Promise<Category[]>;
}

export class CategoryRepository implements ICategoryRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }
  async findAll(): Promise<Category[]> {
    try {
      const [rows] = await this.connection.query("SELECT * FROM category WHERE is_deleted = 0 AND is_shown = 1");
      return rows as Category[];
    } catch (error) {
      return [];
    }
  }
}
