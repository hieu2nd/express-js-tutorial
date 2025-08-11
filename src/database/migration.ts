import type { Pool } from "mysql2/promise";

export interface Migration {
  id: string;
  name: string;
  up: (db: Pool) => Promise<void>;
  down: (db: Pool) => Promise<void>;
}

export abstract class BaseMigration implements Migration {
  abstract id: string;
  abstract name: string;

  abstract up(db: Pool): Promise<void>;
  abstract down(db: Pool): Promise<void>;

  protected async executeQuery(db: Pool, query: string): Promise<void> {
    try {
      await db.execute(query);
    } catch (error) {
      console.error(`Migration error: ${error}`);
      throw error;
    }
  }

  protected async executeMultipleQueries(db: Pool, queries: string[]): Promise<void> {
    for (const query of queries) {
      if (query.trim()) {
        await this.executeQuery(db, query);
      }
    }
  }
}
