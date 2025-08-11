import type { Customer, User } from "@/common/utils/baseSchemas";
import Database from "@/database";
import bcrypt from "bcryptjs";
import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { CustomerAccountRequest, CustomerQueryRow, CustomerRegistrationRequestBody } from "./authModel";
export interface IAuthRepository {
  findByUsernameAsync(username: string): Promise<CustomerQueryRow | null>;
  findByIdAsync(id: number): Promise<Customer | null>;
  createCustomerAccountAsync(registerData: CustomerRegistrationRequestBody): Promise<CustomerQueryRow>;
  updateAccountAsync(id: number, accountData: Partial<CustomerAccountRequest>): Promise<CustomerAccountRequest | null>;
}

class AuthRepository implements IAuthRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }
  async findByUsernameAsync(username: string): Promise<CustomerQueryRow | null> {
    const query = `
      SELECT 
        a.id, a.username, a.password, a.is_active, a.is_deleted, a.created_at, a.updated_at,
        u.full_name, u.email, u.phone_number, u.address, u.dob,
        c.status
      FROM account a 
      JOIN user u ON a.id = u.id 
      JOIN customer c ON u.id = c.id 
      WHERE a.username = ? AND a.is_deleted = 0
    `;
    const [rows] = await this.connection.query<RowDataPacket[]>(query, [username]);
    return rows.length > 0 ? (rows[0] as CustomerQueryRow) : null;
  }

  async findByIdAsync(id: number): Promise<Customer | null> {
    const query = `
      SELECT c.*, u.*, a.username, a.is_active
      FROM customer c
      JOIN user u ON c.id = u.id
      JOIN account a ON u.id = a.id
      WHERE c.id = ? AND a.is_deleted = 0
    `;
    const [rows] = await this.connection.query<RowDataPacket[]>(query, [id]);
    return rows.length > 0 ? (rows[0] as Customer) : null;
  }

  async createCustomerAccountAsync(registerData: CustomerRegistrationRequestBody): Promise<CustomerQueryRow> {
    let connection: PoolConnection | undefined;
    try {
      connection = await this.connection.getConnection();
      await connection.beginTransaction();

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(registerData.password, salt);

      // Insert into account table
      const [accountResult] = await connection.query<ResultSetHeader>(
        "INSERT INTO account (username, password, role_id, is_active, created_at, updated_at, is_deleted) VALUES (?, ?, 3, 1, NOW(), NOW(), 0)",
        [registerData.username, hashedPassword],
      );
      const insertId = accountResult.insertId;

      // Insert into user table
      await connection.query(
        "INSERT INTO user (id, full_name, phone_number, email, address, dob, is_deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), NOW())",
        [
          insertId,
          registerData.full_name,
          registerData.phone_number,
          registerData.email,
          registerData.address,
          registerData.dob || null,
        ],
      );

      // Insert into customer table
      await connection.query("INSERT INTO customer (id, status, created_at) VALUES (?, ?, NOW())", [
        insertId,
        registerData.status || "active",
      ]);

      // Fetch the complete customer data
      const [response] = await connection.query<RowDataPacket[]>(
        `SELECT 
          a.id, a.username, a.password, a.is_active, a.is_deleted, a.created_at, a.updated_at,
          u.full_name, u.email, u.phone_number, u.address, u.dob,
          c.status
        FROM account a 
        JOIN user u ON a.id = u.id 
        JOIN customer c ON u.id = c.id 
        WHERE a.id = ?`,
        [insertId],
      );

      await connection.commit();
      return response[0] as CustomerQueryRow;
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

  async updateAccountAsync(
    id: number,
    accountData: Partial<CustomerAccountRequest>,
  ): Promise<CustomerAccountRequest | null> {
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
