import { migrationService } from "@/database/migrationService";
import { logger } from "@/server";

/**
 * Initialize database by running pending migrations
 * This function can be called during application startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    logger.info("🔍 Checking for pending migrations...");

    const hasPending = await migrationService.hasPendingMigrations();

    if (hasPending) {
      logger.info("🚀 Running pending migrations...");
      await migrationService.runMigrations();
      logger.info("✅ Database migrations completed successfully");
    } else {
      logger.info("✅ Database is up to date");
    }
  } catch (error) {
    logger.error("❌ Database initialization failed:", error);
    throw error;
  }
}

/**
 * Initialize database with option to skip on error
 * Useful for development environments
 */
export async function initializeDatabaseSafe(skipOnError = false): Promise<boolean> {
  try {
    await initializeDatabase();
    return true;
  } catch (error) {
    if (skipOnError) {
      logger.warn("⚠️  Database initialization failed but continuing anyway:", error);
      return false;
    }
    throw error;
  }
}
