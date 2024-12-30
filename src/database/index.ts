import { env } from "@/common/utils/envConfig";
import mysql, { type Connection } from "mysql2";

class Database {
  private static instance: Database;
  private connection: Connection;

  private constructor() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = env;
    this.connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    this.connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the database:", err);
      } else {
        console.log("Connected to MySQL database!");
      }
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getConnection(): Connection {
    return this.connection;
  }
}

export default Database;
