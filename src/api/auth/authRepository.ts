import type { CustomerAccountRequest } from "@/api/auth/authModel";
import Database from "@/database";
import bcrypt from "bcryptjs";
import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { Customer, User } from "../user/userModel";
export interface IAuthRepository {
  findByUsernameAsync(username: string): Promise<User | null>;
  findByIdAsync(id: number): Promise<Customer | null>;
  createCustomerAccountAsync(registerData: CustomerAccountRequest): Promise<Customer>;
  updateAccountAsync(id: number, accountData: Partial<CustomerAccountRequest>): Promise<CustomerAccountRequest | null>;
}

class AuthRepository implements IAuthRepository {
  private connection: Pool;
  constructor() {
    this.connection = Database.getInstance().getConnection();
  }
  async findByUsernameAsync(username: string): Promise<User | null> {
    // TODO: Implement database query to find account by username
    // Example using your database connection:
    // const query = 'SELECT * FROM account WHERE username = ? AND is_deleted = 0';
    // const [rows] = await db.execute(query, [username]);
    // return rows.length > 0 ? rows[0] as Account : null;

    const query = "SELECT a.*, u.* FROM account a JOIN user u ON a.id = u.id WHERE a.username = ? AND a.is_deleted = 0";
    const [rows] = await this.connection.query<RowDataPacket[]>(query, [username]);
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async findByIdAsync(id: number): Promise<Customer | null> {
    // TODO: Implement database query to find account by id
    // Example using your database connection:
    // const query = 'SELECT * FROM account WHERE id = ? AND is_deleted = 0';
    // const [rows] = await db.execute(query, [id]);
    // return rows.length > 0 ? rows[0] as Account : null;
    const query = "SELECT * FROM account WHERE id = ? AND is_deleted = 0";
    const [rows] = await this.connection.query<RowDataPacket[]>(query, [id]);
    return rows.length > 0 ? (rows[0] as Customer) : null;
  }

  async createCustomerAccountAsync(registerData: CustomerAccountRequest): Promise<Customer> {
    // TODO: Implement database insert for new account
    // Example using your database connection:
    // const query = `
    //   INSERT INTO account (username, password, is_active, created_at, updated_at, is_deleted)
    //   VALUES (?, ?, 1, NOW(), NOW(), 0)
    // `;
    // const [result] = await db.execute(query, [
    //   accountData.username,
    //   accountData.password
    // ]);
    // return this.findByIdAsync(result.insertId);

    // Temporary mock implementation
    let connection: PoolConnection | undefined;
    try {
      connection = await this.connection.getConnection();
      await connection.beginTransaction();
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(registerData.body.password, salt);
      const rows = await this.connection.query<[RowDataPacket[], ResultSetHeader]>(
        "INSERT INTO account (username,password,is_active,created_at,updated_at,is_deleted) VALUES (?, ?, 1, NOW(), NOW(), 0)",
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
      await this.connection.query("INSERT INTO customer (id,created_at) VALUES (?, NOW())", [insertId]);
      const [response] = await this.connection.query<RowDataPacket[]>(
        "SELECT a.username, u.*, c.status FROM account a JOIN user u ON a.id = u.id JOIN customer c ON u.id = c.id WHERE u.id = ?",
        [insertId],
      );
      await connection.commit();
      return response[0] as Customer;
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
