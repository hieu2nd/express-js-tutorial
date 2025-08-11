import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { EmployeeAccountRequest, LoginRequest, RefreshTokenRequestBody } from "./authModel.admin";
import { adminAuthService } from "./authService.admin";

interface IAuthController {
  login: RequestHandler;
  register: RequestHandler;
  refreshToken: RequestHandler;
  verifyToken: RequestHandler;
}

class AuthController implements IAuthController {
  public login: RequestHandler = async (req: Request, res: Response) => {
    // The request body is already validated by middleware
    const loginRequest: LoginRequest = req as LoginRequest;
    const serviceResponse = await adminAuthService.login(loginRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public register: RequestHandler = async (req: Request, res: Response) => {
    // The request body is already validated by middleware
    const registerRequest: EmployeeAccountRequest = req as EmployeeAccountRequest;
    const serviceResponse = await adminAuthService.register(registerRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public refreshToken: RequestHandler = async (req: Request, res: Response) => {
    // The request body is already validated by middleware
    const { refreshToken }: RefreshTokenRequestBody = req.body;
    const serviceResponse = await adminAuthService.refreshToken(refreshToken);
    return handleServiceResponse(serviceResponse, res);
  };

  public verifyToken: RequestHandler = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
        errors: [{ field: "authorization", message: "Authorization header is required" }],
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
        errors: [{ field: "token", message: "Bearer token is required" }],
      });
    }

    const serviceResponse = await adminAuthService.verifyToken(token);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const adminAuthController = new AuthController();
