import type { Migration } from "./migration";
import { Migration001_InitialSchema } from "./migrations/001_initial_schema";
import { Migration002_AddForeignKeys } from "./migrations/002_add_foreign_keys";
import { Migration003_AddIndexes } from "./migrations/003_add_indexes";
import { Migration004_SeedRoles } from "./migrations/004_seed_roles";

// Registry of all migrations in order
export const migrations: Migration[] = [
  new Migration001_InitialSchema(),
  new Migration002_AddForeignKeys(),
  new Migration003_AddIndexes(),
  new Migration004_SeedRoles(),
];

// Helper function to get migration by ID
export function getMigrationById(id: string): Migration | undefined {
  return migrations.find((migration) => migration.id === id);
}

// Helper function to get migrations after a certain ID
export function getMigrationsAfter(id: string): Migration[] {
  const index = migrations.findIndex((migration) => migration.id === id);
  if (index === -1) {
    return migrations;
  }
  return migrations.slice(index + 1);
}

// Helper function to get migrations before a certain ID (for rollbacks)
export function getMigrationsBefore(id: string): Migration[] {
  const index = migrations.findIndex((migration) => migration.id === id);
  if (index === -1) {
    return [];
  }
  return migrations.slice(0, index);
}
