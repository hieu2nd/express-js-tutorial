import Database from "@/database";
import bcrypt from "bcryptjs";
import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { Employee } from "../user/userModel";
import { type EmployeeAccountRequest, type EmployeeQueryRow, EmployeeQueryRowSchema } from "./authModel.admin";

export interface IAuthRepository {
  findByUsernameAsync(username: string): Promise<EmployeeQueryRow | null>;
  findByIdAsync(id: number): Promise<EmployeeQueryRow | null>;
  createEmployeeAccountAsync(registerData: EmployeeAccountRequest): Promise<EmployeeQueryRow>;
  updateAccountAsync(id: number, accountData: Partial<EmployeeAccountRequest>): Promise<EmployeeQueryRow | null>;
}

class AuthRepository implements IAuthRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }
  async findByUsernameAsync(username: string): Promise<EmployeeQueryRow | null> {
    const query =
      "SELECT a.*, u.*, e.*, s.code as store_code, s.name as store_name, s.phone_number as store_phone_number, s.address as store_address, s.is_deleted as store_is_deleted FROM account a JOIN user u ON a.id = u.id JOIN employee e ON u.id = e.id JOIN store s ON e.store_id = s.id WHERE a.username = ? AND a.is_deleted = 0";
    const [rows] = await this.connection.query<RowDataPacket[]>(query, [username]);

    if (rows.length > 0) {
      const row = rows[0] as EmployeeQueryRow;

      const validatedRow = EmployeeQueryRowSchema.parse(row) as EmployeeQueryRow;

      return validatedRow;
    }
    return null;
  }

  async findByIdAsync(id: number): Promise<EmployeeQueryRow | null> {
    const query =
      "SELECT a.*, u.*, e.code, e.store_id, s.code as store_code, s.name as store_name, s.phone_number as store_phone_number, s.address as store_address, s.is_deleted as store_is_deleted FROM account a JOIN user u ON a.id = u.id JOIN employee e ON u.id = e.id JOIN store s ON e.store_id = s.id WHERE a.id = ? AND a.is_deleted = 0";
    const [rows] = await this.connection.query<RowDataPacket[]>(query, [id]);

    if (rows.length > 0) {
      const row = rows[0] as EmployeeQueryRow;

      const validatedRow = EmployeeQueryRowSchema.parse(row);
      return validatedRow;
    }
    return null;
  }

  async createEmployeeAccountAsync(registerData: EmployeeAccountRequest): Promise<EmployeeQueryRow> {
    let connection: PoolConnection | undefined;
    try {
      connection = await this.connection.getConnection();
      await connection.beginTransaction();
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(registerData.body.password, salt);
      const rows = await this.connection.query<[RowDataPacket[], ResultSetHeader]>(
        "INSERT INTO account (username,password,role_id,is_active,created_at,updated_at,is_deleted) VALUES (?, ?, 2, 1, NOW(), NOW(), 0)",
        [registerData.body.username, hashedPassword],
      );
      const insertId = (rows[0] as RowDataPacket).insertId;
      await this.connection.query(
        "INSERT INTO user (id,full_name,phone_number,email,address,dob,is_deleted,created_at,updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), NOW())",
        [
          insertId,
          registerData.body.full_name,
          registerData.body.phone_number,
          registerData.body.email,
          registerData.body.address,
          registerData.body.dob,
        ],
      );
      await this.connection.query("INSERT INTO employee (id,code,store_id) VALUES (?,?,?)", [
        insertId,
        registerData.body.code,
        registerData.body.store_id,
      ]);
      const [response] = await this.connection.query<RowDataPacket[]>(
        "SELECT a.username, u.*, e.code, e.store_id, s.code as store_code, s.name as store_name, s.phone_number as store_phone_number, s.address as store_address, s.is_deleted as store_is_deleted FROM account a JOIN user u ON a.id = u.id JOIN employee e ON u.id = e.id JOIN store s ON e.store_id = s.id WHERE u.id = ?",
        [insertId],
      );

      // Transform the flat result into the expected Employee structure without password
      const row = response[0] as EmployeeQueryRow;
      await connection.commit();
      return row;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async updateAccountAsync(id: number, accountData: Partial<EmployeeAccountRequest>): Promise<EmployeeQueryRow | null> {
    // TODO: Implement database update for account
    // Example using your database connection:
    // const query = `
    //   UPDATE account
    //   SET username = ?, is_active = ?, updated_at = NOW()
    //   WHERE id = ? AND is_deleted = 0
    // `;
    // await db.execute(query, [
    //   accountData.username,
    //   accountData.is_active,
    //   id
    // ]);
    // return this.findByIdAsync(id);

    // Temporary mock implementation
    console.log(`Updating account ${id}:`, accountData);
    return null;
  }
}

export const authRepository = new AuthRepository();
