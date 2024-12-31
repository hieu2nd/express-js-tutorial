import type { User } from "@/api/user/userModel";
import Database from "@/database";
import { logger } from "@/server";
import type { Request, Response } from "express";
import { Connection, type RowDataPacket } from "mysql2";
import type { Pool } from "mysql2/promise";
import type { Category } from "./categoryModel";

export const categories: Category[] = [
  {
    id: 1,
    name: "Alice",
    is_deleted: 0,
    image_url: "",
  },
  {
    id: 2,
    name: "Alice",
    is_deleted: 0,
    image_url: "",
  },
];

export class CategoryRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }
  async findAllAsync(): Promise<Category[]> {
    try {
      const [rows] = await this.connection.query("SELECT * FROM category");
      return rows as Category[];
    } catch (error) {
      return [];
    }
  }

  async findByIdAsync(req: Request, _: Response): Promise<Category | null> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[]>("SELECT * FROM category WHERE id = ?", [
        req.params.id,
      ]);
      return rows[0] as Category;
    } catch (error) {
      return null;
    }
  }
  async createAsync(req: Request): Promise<void> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[]>(
        "INSERT INTO category (name, is_deleted) VALUES (?, ?)",
        [req.params.name, req.params.is_deleted],
      );
      logger.info(rows, "ndh");
    } catch (error) {}
  }
}
