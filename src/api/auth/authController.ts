import type { Request, RequestHandler, Response } from "express";

import { authService } from "@/api/auth/authService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class AuthController {
  public login: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.login(req);
    return handleServiceResponse(serviceResponse, res);
  };

  public registerCustomer: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.registerCustomer(req);
    return handleServiceResponse(serviceResponse, res);
  };

  public refreshToken: RequestHandler = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const serviceResponse = await authService.refreshToken(refreshToken);
    return handleServiceResponse(serviceResponse, res);
  };

  public verifyToken: RequestHandler = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const serviceResponse = await authService.verifyToken(token);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const authController = new AuthController();
