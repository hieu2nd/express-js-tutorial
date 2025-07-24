import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { JwtPayload } from "@/api/auth/authModel";
import { authService } from "@/api/auth/authService";

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
