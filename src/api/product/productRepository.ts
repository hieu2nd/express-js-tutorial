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
      const [rows] = await this.connection.query("SELECT * FROM product WHERE is_deleted = 0");
      return rows as Product[];
    } catch (error) {
      return [];
    }
  }

  async findByIdAsync(req: Request, _: Response): Promise<Product | null> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[]>(
        "SELECT * FROM product WHERE id = ? AND is_deleted = 0",
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
        "UPDATE product SET is_deleted = 1 WHERE id = ?",
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
      const updateFields: Record<string, any> = {};

      // Build update object dynamically
      if (req.body.code !== undefined) updateFields.code = req.body.code;
      if (req.body.name !== undefined) updateFields.name = req.body.name;
      if (req.body.price !== undefined) updateFields.price = req.body.price;
      if (req.body.unit !== undefined) updateFields.unit = req.body.unit;
      if (req.body.description !== undefined) updateFields.description = req.body.description;
      if (req.body.rating !== undefined) updateFields.rating = req.body.rating;
      if (req.body.promotion_id !== undefined) updateFields.promotion_id = req.body.promotion_id;
      if (req.body.is_deleted !== undefined) updateFields.is_deleted = req.body.is_deleted;

      const fieldNames = Object.keys(updateFields);
      if (fieldNames.length === 0) {
        throw new Error("No fields to update");
      }

      // Build query and values array
      const setClause = fieldNames.map((field) => `${field} = ?`).join(", ");
      const values = Object.values(updateFields);

      const query = `UPDATE product SET ${setClause}, updated_at = NOW() WHERE id = ?`;

      await this.connection.query<[RowDataPacket[], ResultSetHeader]>(query, [...values, req.params.id]);

      // Fetch and return updated product
      const [response] = await this.connection.query<RowDataPacket[]>(
        "SELECT * FROM product WHERE id = ?",
        req.params.id,
      );

      return (response[0] as Product) || null;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}
