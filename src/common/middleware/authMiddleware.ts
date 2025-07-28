import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { JwtPayload } from "@/api/client/auth/authModel";
import { authService } from "@/api/client/auth/authService";

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Access token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Access token is required",
      });
    }

    const serviceResponse = await authService.verifyToken(token);

    if (!serviceResponse.success || !serviceResponse.response) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    req.user = serviceResponse.response;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      if (token) {
        const serviceResponse = await authService.verifyToken(token);

        if (serviceResponse.success && serviceResponse.response) {
          req.user = serviceResponse.response;
        }
      }
    }

    next();
  } catch (error) {
    // For optional auth, we continue even if token is invalid
    next();
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First ensure user is authenticated
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
    }

    // TODO: Check if user has admin role
    // This assumes you have a role field or admin flag in your user data
    // You might need to fetch user details from database to check role
    // For now, this is a placeholder - you'll need to implement based on your user schema

    // Example implementation (adjust based on your actual user schema):
    // const user = await userRepository.findByIdAsync(req.user.userId);
    // if (!user || user.role !== 'admin') {
    //   return res.status(StatusCodes.FORBIDDEN).json({
    //     success: false,
    //     message: "Admin access required",
    //   });
    // }

    // Temporary: Allow all authenticated users (you should implement proper role check)
    console.warn("Admin authorization not fully implemented - allowing all authenticated users");
    next();
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Admin access required",
    });
  }
};

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Authentication required",
        });
      }

      // TODO: Implement role-based authorization
      // This is a flexible middleware for different roles
      // Example:
      // const user = await userRepository.findByIdAsync(req.user.userId);
      // if (!user || !roles.includes(user.role)) {
      //   return res.status(StatusCodes.FORBIDDEN).json({
      //     success: false,
      //     message: `Access denied. Required roles: ${roles.join(', ')}`,
      //   });
      // }

      console.warn(`Role authorization not fully implemented - required roles: ${roles.join(", ")}`);
      next();
    } catch (error) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Access denied",
      });
    }
  };
};
