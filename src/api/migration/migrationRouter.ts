import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { migrationService } from "@/database/migrationService";
import { Router } from "express";

export const migrationRouter = Router();

/**
 * GET /migration/status
 * @summary Get migration status
 * @tags Migration
 * @returns {object} 200 - Migration status information
 */
migrationRouter.get("/status", async (req, res) => {
  try {
    const status = await migrationService.getMigrationStatus();
    const serviceResponse = ServiceResponse.success("Migration status retrieved", status);
    return handleServiceResponse(serviceResponse, res);
  } catch (error) {
    const serviceResponse = ServiceResponse.failure("Failed to get migration status", null, 500);
    return handleServiceResponse(serviceResponse, res);
  }
});

/**
 * GET /migration/health
 * @summary Check if database is up to date
 * @tags Migration
 * @returns {object} 200 - Database health status
 */
migrationRouter.get("/health", async (req, res) => {
  try {
    const hasPending = await migrationService.hasPendingMigrations();
    const status = {
      database: "connected",
      migrations: hasPending ? "pending" : "up-to-date",
      hasPendingMigrations: hasPending,
    };

    const serviceResponse = ServiceResponse.success("Database health check", status);
    return handleServiceResponse(serviceResponse, res);
  } catch (error) {
    const status = {
      database: "error",
      migrations: "unknown",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    const serviceResponse = ServiceResponse.failure("Database health check failed", status, 500);
    return handleServiceResponse(serviceResponse, res);
  }
});
