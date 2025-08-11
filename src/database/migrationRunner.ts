import type { Pool } from "mysql2/promise";
import Database from "./index";
import type { Migration } from "./migration";

export class MigrationRunner {
  private db: Pool;

  constructor() {
    this.db = Database.getInstance().getConnection();
  }

  async createMigrationsTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await this.db.execute(createTableQuery);
      console.log("✅ Migrations table created/verified");
    } catch (error) {
      console.error("❌ Failed to create migrations table:", error);
      throw error;
    }
  }

  async getExecutedMigrations(): Promise<string[]> {
    try {
      const [rows] = await this.db.execute("SELECT id FROM migrations ORDER BY executed_at ASC");
      return (rows as any[]).map((row) => row.id);
    } catch (error) {
      console.error("❌ Failed to get executed migrations:", error);
      throw error;
    }
  }

  async markMigrationAsExecuted(migration: Migration): Promise<void> {
    try {
      await this.db.execute("INSERT INTO migrations (id, name) VALUES (?, ?)", [migration.id, migration.name]);
      console.log(`✅ Migration ${migration.id} marked as executed`);
    } catch (error) {
      console.error(`❌ Failed to mark migration ${migration.id} as executed:`, error);
      throw error;
    }
  }

  async removeMigrationRecord(migrationId: string): Promise<void> {
    try {
      await this.db.execute("DELETE FROM migrations WHERE id = ?", [migrationId]);
      console.log(`✅ Migration ${migrationId} record removed`);
    } catch (error) {
      console.error(`❌ Failed to remove migration ${migrationId} record:`, error);
      throw error;
    }
  }

  async runMigrations(migrations: Migration[]): Promise<void> {
    await this.createMigrationsTable();

    const executedMigrations = await this.getExecutedMigrations();
    const pendingMigrations = migrations.filter((migration) => !executedMigrations.includes(migration.id));

    if (pendingMigrations.length === 0) {
      console.log("✅ No pending migrations to run");
      return;
    }

    console.log(`🚀 Running ${pendingMigrations.length} pending migration(s)...`);

    for (const migration of pendingMigrations) {
      console.log(`⏳ Running migration: ${migration.name} (${migration.id})`);

      try {
        await migration.up(this.db);
        await this.markMigrationAsExecuted(migration);
        console.log(`✅ Migration ${migration.name} completed successfully`);
      } catch (error) {
        console.error(`❌ Migration ${migration.name} failed:`, error);
        throw error;
      }
    }

    console.log("🎉 All migrations completed successfully!");
  }

  async rollbackMigration(migration: Migration): Promise<void> {
    const executedMigrations = await this.getExecutedMigrations();

    if (!executedMigrations.includes(migration.id)) {
      console.log(`⚠️  Migration ${migration.id} has not been executed`);
      return;
    }

    console.log(`⏳ Rolling back migration: ${migration.name} (${migration.id})`);

    try {
      await migration.down(this.db);
      await this.removeMigrationRecord(migration.id);
      console.log(`✅ Migration ${migration.name} rolled back successfully`);
    } catch (error) {
      console.error(`❌ Rollback of migration ${migration.name} failed:`, error);
      throw error;
    }
  }

  async rollbackLastMigration(migrations: Migration[]): Promise<void> {
    const executedMigrations = await this.getExecutedMigrations();

    if (executedMigrations.length === 0) {
      console.log("⚠️  No migrations to rollback");
      return;
    }

    const lastExecutedId = executedMigrations[executedMigrations.length - 1];
    const lastMigration = migrations.find((m) => m.id === lastExecutedId);

    if (!lastMigration) {
      console.error(`❌ Could not find migration ${lastExecutedId} in migration files`);
      throw new Error(`Migration ${lastExecutedId} not found`);
    }

    await this.rollbackMigration(lastMigration);
  }

  async getMigrationStatus(migrations: Migration[]): Promise<void> {
    await this.createMigrationsTable();
    const executedMigrations = await this.getExecutedMigrations();

    console.log("\n📊 Migration Status:");
    console.log("===================");

    if (migrations.length === 0) {
      console.log("⚠️  No migration files found");
      return;
    }

    for (const migration of migrations) {
      const status = executedMigrations.includes(migration.id) ? "✅ EXECUTED" : "⏳ PENDING";
      console.log(`${status} | ${migration.id} | ${migration.name}`);
    }

    const pendingCount = migrations.filter((m) => !executedMigrations.includes(m.id)).length;
    console.log(
      `\nTotal: ${migrations.length} migrations | Pending: ${pendingCount} | Executed: ${executedMigrations.length}`,
    );
  }
}
