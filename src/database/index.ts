import { env } from "@/common/utils/envConfig";
import { type Pool, createPool } from "mysql2/promise";

class Database {
  private static instance: Database;
  private connection: Pool;

  private constructor() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = env;
    this.connection = createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getConnection(): Pool {
    return this.connection;
  }
}

export default Database;
