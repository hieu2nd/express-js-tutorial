import Database from "@/database";
import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import type { Pool } from "mysql2/promise";
import type { Product } from "./productModel";

interface IProductRepository {
  findAllAsync(): Promise<Product[]>;
  findByIdAsync(req: Request, res: Response): Promise<Product | null>;
}

export class ProductRepository implements IProductRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }
  async findAllAsync(): Promise<Product[]> {
    try {
      const [rows] = await this.connection.query("SELECT * FROM product WHERE is_deleted = 0 AND is_shown = 1");
      return rows as Product[];
    } catch (error) {
      return [];
    }
  }

  async findByIdAsync(req: Request, _: Response): Promise<Product | null> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[]>(
        "SELECT * FROM product WHERE id = ? AND is_deleted = 0 AND is_shown = 1",
        [req.params.id],
      );
      return rows[0] as Product;
    } catch (error) {
      return null;
    }
  }
}
