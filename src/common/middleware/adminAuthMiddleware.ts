import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { JwtPayload } from "@/api/admin/auth/authModel.admin";
import { ROLES } from "@/api/admin/auth/authModel.admin";
import { adminAuthService } from "@/api/admin/auth/authService.admin";

declare global {
  namespace Express {
    interface Request {
      adminUser?: JwtPayload;
    }
  }
}

/**
 * Middleware for authenticating admin/employee tokens
 * This should be used on admin routes to ensure only authenticated employees can access them
 */
export const authenticateAdminToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Admin access token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Admin access token is required",
      });
    }

    const serviceResponse = await adminAuthService.verifyToken(token);

    if (!serviceResponse.success || !serviceResponse.response) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired admin token",
      });
    }

    // Set both user and adminUser for backward compatibility
    req.user = serviceResponse.response;
    req.adminUser = serviceResponse.response;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};

/**
 * Middleware for role-based authorization within admin panel
 * Requires role_id = 2 (ADMIN role)
 */
export const requireAdminRole = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Admin authentication required",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Access token is required",
        });
      }

      // Verify the token using admin auth service
      const verifyResponse = await adminAuthService.verifyToken(token);

      if (!verifyResponse.success || !verifyResponse.response) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Invalid or expired admin token",
        });
      }

      // Check if user has role_id = ROLES.EMPLOYEE (2)
      if (!verifyResponse.response.role_id || verifyResponse.response.role_id !== ROLES.ADMIN) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Access denied. Admin role required",
        });
      }

      // Set user data for downstream middleware/controllers
      req.user = verifyResponse.response;
      req.adminUser = verifyResponse.response;
      next();
    } catch (error) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Access denied",
      });
    }
  };
};
