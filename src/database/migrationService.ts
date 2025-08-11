import { migrations } from "./migrationRegistry";
import { MigrationRunner } from "./migrationRunner";

export class MigrationService {
  private runner: MigrationRunner;

  constructor() {
    this.runner = new MigrationRunner();
  }

  /**
   * Run all pending migrations
   */
  async runMigrations(): Promise<void> {
    return this.runner.runMigrations(migrations);
  }

  /**
   * Check if there are pending migrations
   */
  async hasPendingMigrations(): Promise<boolean> {
    await this.runner.createMigrationsTable();
    const executedMigrations = await this.runner.getExecutedMigrations();
    const pendingMigrations = migrations.filter((migration) => !executedMigrations.includes(migration.id));
    return pendingMigrations.length > 0;
  }

  /**
   * Get migration status information
   */
  async getMigrationStatus(): Promise<{
    total: number;
    executed: number;
    pending: number;
    pendingMigrations: string[];
  }> {
    await this.runner.createMigrationsTable();
    const executedMigrations = await this.runner.getExecutedMigrations();
    const pendingMigrations = migrations.filter((migration) => !executedMigrations.includes(migration.id));

    return {
      total: migrations.length,
      executed: executedMigrations.length,
      pending: pendingMigrations.length,
      pendingMigrations: pendingMigrations.map((m) => m.id),
    };
  }

  /**
   * Rollback the last migration
   */
  async rollbackLastMigration(): Promise<void> {
    return this.runner.rollbackLastMigration(migrations);
  }
}

// Export singleton instance
export const migrationService = new MigrationService();
