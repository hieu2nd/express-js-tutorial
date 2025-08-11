# Database Migration System

This project includes a comprehensive database migration system built for Express.js with TypeScript and MySQL.

## Features

- ✅ **Schema versioning** - Track and apply database changes incrementally
- ✅ **Rollback support** - Safely rollback migrations when needed
- ✅ **CLI tools** - Easy-to-use command line interface
- ✅ **Type-safe** - Full TypeScript support with proper typing
- ✅ **Migration status** - Check which migrations have been applied
- ✅ **Automatic execution** - Run migrations on application startup
- ✅ **Health checks** - API endpoints to check migration status

## Quick Start

### 1. Run All Pending Migrations

```bash
npm run migrate:up
```

### 2. Check Migration Status

```bash
npm run migrate:status
```

### 3. Rollback Last Migration

```bash
npm run migrate:down
```

### 4. Create New Migration

```bash
npm run migrate:create add_user_profile_table
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run migrate:up` | Run all pending migrations |
| `npm run migrate:down` | Rollback the last migration |
| `npm run migrate:status` | Show status of all migrations |
| `npm run migrate:rollback <id>` | Rollback a specific migration by ID |
| `npm run migrate:create <name>` | Create a new migration file |

## Migration Structure

### File Organization

```
src/database/
├── migration.ts              # Base migration interface and class
├── migrationRunner.ts        # Core migration execution logic
├── migrationRegistry.ts      # Registry of all migrations
├── migrationService.ts       # Service for programmatic access
├── init.ts                  # Database initialization utilities
└── migrations/
    ├── 001_initial_schema.ts
    ├── 002_add_foreign_keys.ts
    ├── 003_add_indexes.ts
    └── ...
```

### Migration File Format

Each migration file follows this structure:

```typescript
import { BaseMigration } from "../migration";
import { type Pool } from "mysql2/promise";

export class Migration001_InitialSchema extends BaseMigration {
  id = "001_initial_schema";
  name = "Create initial database schema";

  async up(db: Pool): Promise<void> {
    const queries = [
      "CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255))",
      // ... more queries
    ];
    await this.executeMultipleQueries(db, queries);
  }

  async down(db: Pool): Promise<void> {
    const queries = [
      "DROP TABLE IF EXISTS users",
      // ... rollback queries in reverse order
    ];
    await this.executeMultipleQueries(db, queries);
  }
}
```

## Creating New Migrations

### Step 1: Generate Migration File

```bash
npm run migrate:create add_email_verification
```

This creates a new migration file with a timestamp prefix.

### Step 2: Edit the Migration

Open the generated file and add your SQL queries to the `up()` and `down()` methods.

### Step 3: Register the Migration

Add your new migration to `src/database/migrationRegistry.ts`:

```typescript
import { Migration20240131120000_AddEmailVerification } from "./migrations/20240131120000_add_email_verification";

export const migrations: Migration[] = [
  // ... existing migrations
  new Migration20240131120000_AddEmailVerification(),
];
```

### Step 4: Run the Migration

```bash
npm run migrate:up
```

## Programmatic Usage

You can also use migrations programmatically in your application:

```typescript
import { migrationService } from "@/database/migrationService";

// Run all pending migrations
await migrationService.runMigrations();

// Check if there are pending migrations
const hasPending = await migrationService.hasPendingMigrations();

// Get detailed migration status
const status = await migrationService.getMigrationStatus();
```

## Automatic Migration on Startup

To run migrations automatically when your application starts, add this to your main application file:

```typescript
import { initializeDatabase } from "@/database/init";

// Run migrations on startup
await initializeDatabase();
```

## Migration Status API

The system includes API endpoints to check migration status:

### GET /migration/status

Returns detailed information about all migrations:

```json
{
  "success": true,
  "message": "Migration status retrieved",
  "responseObject": {
    "total": 3,
    "executed": 2,
    "pending": 1,
    "pendingMigrations": ["003_add_indexes"]
  }
}
```

### GET /migration/health

Returns database health information:

```json
{
  "success": true,
  "message": "Database health check",
  "responseObject": {
    "database": "connected",
    "migrations": "up-to-date",
    "hasPendingMigrations": false
  }
}
```

## Best Practices

### 1. Migration Naming

- Use descriptive names: `add_user_email_index` instead of `migration1`
- Use snake_case for consistency
- Include action and target: `create_orders_table`, `add_email_to_users`

### 2. Writing Migrations

- **Always include rollback logic** in the `down()` method
- **Test rollbacks** before deploying to production
- **Use transactions** for complex migrations
- **Be backwards compatible** when possible

### 3. Database Changes

- **Add columns with DEFAULT values** to avoid issues with existing data
- **Create indexes in separate migrations** for large tables
- **Never modify existing migrations** once they're deployed

### 4. Production Deployment

- **Backup your database** before running migrations
- **Test migrations** on a copy of production data
- **Run migrations during maintenance windows** for large changes
- **Monitor migration execution** for performance issues

## Troubleshooting

### Migration Failed

If a migration fails:

1. Check the error message in the console
2. Fix the issue in your migration file
3. Manually clean up any partial changes in the database
4. Re-run the migration

### Rollback Issues

If rollback fails:

1. Check the `down()` method in your migration
2. Manually revert database changes if necessary
3. Remove the migration record from the `migrations` table

### Performance Issues

For large migrations:

1. Consider breaking them into smaller chunks
2. Run during low-traffic periods
3. Use database-specific optimization techniques
4. Monitor server resources during execution

## Environment Setup

Ensure your environment variables are properly configured:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

The migration system uses the same database connection as your main application.
