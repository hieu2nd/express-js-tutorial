#!/usr/bin/env tsx

import { program } from "commander";
import { getMigrationById, migrations } from "../database/migrationRegistry";
import { MigrationRunner } from "../database/migrationRunner";

const runner = new MigrationRunner();

program.name("migrate").description("Database migration CLI tool").version("1.0.0");

program
  .command("up")
  .description("Run all pending migrations")
  .action(async () => {
    try {
      await runner.runMigrations(migrations);
      process.exit(0);
    } catch (error) {
      console.error("❌ Migration failed:", error);
      process.exit(1);
    }
  });

program
  .command("down")
  .description("Rollback the last migration")
  .action(async () => {
    try {
      await runner.rollbackLastMigration(migrations);
      process.exit(0);
    } catch (error) {
      console.error("❌ Rollback failed:", error);
      process.exit(1);
    }
  });

program
  .command("rollback")
  .description("Rollback a specific migration by ID")
  .argument("<migrationId>", "ID of the migration to rollback")
  .action(async (migrationId: string) => {
    try {
      const migration = getMigrationById(migrationId);
      if (!migration) {
        console.error(`❌ Migration with ID '${migrationId}' not found`);
        process.exit(1);
      }

      await runner.rollbackMigration(migration);
      process.exit(0);
    } catch (error) {
      console.error("❌ Rollback failed:", error);
      process.exit(1);
    }
  });

program
  .command("status")
  .description("Show migration status")
  .action(async () => {
    try {
      await runner.getMigrationStatus(migrations);
      process.exit(0);
    } catch (error) {
      console.error("❌ Failed to get migration status:", error);
      process.exit(1);
    }
  });

program
  .command("create")
  .description("Create a new migration file")
  .argument("<name>", "Name of the migration (use snake_case)")
  .action(async (name: string) => {
    try {
      const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
      const migrationId = `${timestamp}_${name}`;
      const className = name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

      const migrationTemplate = `import { BaseMigration } from "../migration";
import { type Pool } from "mysql2/promise";

export class Migration${timestamp}_${className} extends BaseMigration {
  id = "${migrationId}";
  name = "${name.replace(/_/g, " ")}";

  async up(db: Pool): Promise<void> {
    const queries = [
      // Add your migration queries here
      // Example: "CREATE TABLE example (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255))"
    ];

    await this.executeMultipleQueries(db, queries);
  }

  async down(db: Pool): Promise<void> {
    const queries = [
      // Add your rollback queries here (reverse order of up queries)
      // Example: "DROP TABLE IF EXISTS example"
    ];

    await this.executeMultipleQueries(db, queries);
  }
}`;

      const fs = await import("node:fs/promises");
      const path = await import("node:path");

      const migrationPath = path.join(process.cwd(), "src", "database", "migrations", `${migrationId}.ts`);

      await fs.writeFile(migrationPath, migrationTemplate);

      console.log(`✅ Created migration file: ${migrationPath}`);
      console.log(`📝 Don't forget to add the migration to migrationRegistry.ts:`);
      console.log(`   import { Migration${timestamp}_${className} } from "./migrations/${migrationId}";`);
      console.log(`   // Add to migrations array: new Migration${timestamp}_${className}(),`);

      process.exit(0);
    } catch (error) {
      console.error("❌ Failed to create migration:", error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
