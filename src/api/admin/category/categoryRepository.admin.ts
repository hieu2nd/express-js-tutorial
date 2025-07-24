import { ApiOptions } from "@/common/models/common";
import Database from "@/database";
import { logger } from "@/server";
import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { Category, CreateCategoryPayload } from "./categoryModel.admin";

interface ICategoryRepository {
  findAllAsync(): Promise<Category[]>;
  findByIdAsync(req: Request, res: Response): Promise<Category | null>;
  createAsync(req: Request<any, any, CreateCategoryPayload>): Promise<Category | null>;
  deleteAsync(req: Request): Promise<any | null>;
  updateAsync(req: Request): Promise<Category | null>;
}

export class CategoryRepository implements ICategoryRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }
  async findAllAsync(): Promise<Category[]> {
    try {
      const [rows] = await this.connection.query("SELECT * FROM category WHERE is_deleted = 0 AND is_shown = 1");
      return rows as Category[];
    } catch (error) {
      return [];
    }
  }

  async findByIdAsync(req: Request, _: Response): Promise<Category | null> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[]>(
        "SELECT * FROM category WHERE id = ? AND is_deleted = 0 AND is_shown = 1",
        [req.params.id],
      );
      return rows[0] as Category;
    } catch (error) {
      return null;
    }
  }
  async createAsync(req: Request<any, any, CreateCategoryPayload>): Promise<Category | null> {
    try {
      const rows = await this.connection.query<[RowDataPacket[], ResultSetHeader]>(
        "INSERT INTO category (name,is_deleted,image_url,is_shown) VALUES (?,0,?,1)",
        [req.body.name, req.body.image_url],
      );
      const insertId = (rows[0] as RowDataPacket).insertId;
      const [response] = await this.connection.query<RowDataPacket[]>("SELECT * from category WHERE id = ?", insertId);
      return response[0] as Category;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
  async deleteAsync(req: Request): Promise<any | null> {
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
  async updateAsync(req: Request): Promise<Category | null> {
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
      return response[0] as Category;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}
