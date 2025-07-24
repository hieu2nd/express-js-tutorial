import Database from "@/database";
import { logger } from "@/server";
import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { CreateProductPayload, Product } from "./productModel";

export class ProductRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }
  async findAllAsync(): Promise<Product[]> {
    try {
      const [rows] = await this.connection.query("SELECT * FROM category WHERE is_deleted = 0");
      return rows as Product[];
    } catch (error) {
      return [];
    }
  }

  async findByIdAsync(req: Request, _: Response): Promise<Product | null> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[]>(
        "SELECT * FROM category WHERE id = ? AND is_deleted = 0 AND is_shown = 1",
        [req.params.id],
      );
      return rows[0] as Product;
    } catch (error) {
      return null;
    }
  }
  async createAsync(req: Request): Promise<Product | null> {
    try {
      const connection = await this.connection.getConnection();
      await connection.beginTransaction();
      const rows = await this.connection.query<[RowDataPacket[], ResultSetHeader]>(
        "INSERT INTO product (code, name, price, unit, description, rating, created_at, updated_at, is_deleted, promotion_id) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 0, ?)",
        [
          req.body.code,
          req.body.name,
          req.body.price,
          req.body.unit,
          req.body.description,
          req.body.rating,
          req.body.promotion_id,
        ],
      );
      const insertId = (rows[0] as RowDataPacket).insertId;
      await this.connection.query("INSERT INTO product_category (product_id, category_id) VALUES (?, ?)", [
        insertId,
        req.body.category_id,
      ]);
      const [response] = await this.connection.query<RowDataPacket[]>("SELECT * from product WHERE id = ?", insertId);
      await connection.commit();
      return response[0] as Product;
    } catch (error) {
      this.connection.getConnection().then((value) => {
        value.rollback();
      });
      logger.error(error);
      return null;
    } finally {
      this.connection.getConnection().then((value) => {
        value.release();
      });
    }
  }
  async deleteAsync(req: Request): Promise<Record<string, never> | null> {
    try {
      await this.connection.query<[RowDataPacket[], ResultSetHeader]>(
        "UPDATE category SET is_deleted = 1 WHERE id = ?",
        [req.params.id],
      );
      return {};
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
  async updateAsync(req: Request): Promise<Product | null> {
    try {
      const values = [];
      const queryParams = [];
      if (req.body.name) {
        values.push(req.body.name);
        queryParams.push("name = ?");
      }
      if (req.body.image_url) {
        values.push(req.body.image_url);
        queryParams.push("image_url = ?");
      }
      if (req.body.is_shown !== undefined) {
        values.push(req.body.is_shown);
        queryParams.push("is_shown = ?");
      }
      if (!values.length || !queryParams.length) throw new Error("Empty Query");
      const query = `UPDATE category SET ${queryParams.join(",")} WHERE id = ?`;
      await this.connection.query<[RowDataPacket[], ResultSetHeader]>(query, [...values, req.params.id]);
      const [response] = await this.connection.query<RowDataPacket[]>(
        "SELECT * from category WHERE id = ?",
        req.params.id,
      );
      return response[0] as Product;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}
