import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type {
  EmployeeAccountRequest,
  JwtPayload,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  VerifyTokenResponse,
} from "./authModel.admin";
import { EmployeeRegistrationRequestBodySchema, LoginRequestBodySchema } from "./authModel.admin";
import { authRepository } from "./authRepository.admin";
export class AdminAuthService {
  private readonly JWT_SECRET: string = env.JWT_SECRET;
  private readonly JWT_EXPIRES_IN: string | number = env.JWT_EXPIRES_IN;
  private readonly REFRESH_TOKEN_EXPIRES_IN: string | number = env.REFRESH_TOKEN_EXPIRES_IN;

  async login(credentials: LoginRequest): Promise<ServiceResponse<LoginResponse | null>> {
    try {
      const validatedCredentials = LoginRequestBodySchema.parse(credentials.body);

      const foundUser = await authRepository.findByUsernameAsync(validatedCredentials.username);
      if (!foundUser) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
      }

      const isPasswordValid = await bcrypt.compare(validatedCredentials.password, foundUser.password);
      if (!isPasswordValid) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
      }

      if (!foundUser.is_active) {
        return ServiceResponse.failure("Account is inactive", null, StatusCodes.UNAUTHORIZED);
      }

      const accessToken = this.generateAccessToken({
        userId: foundUser.id,
        username: foundUser.username,
        role_id: foundUser.role_id,
      });

      const response: LoginResponse = {
        token: accessToken,
        user: {
          id: foundUser.id,
          username: foundUser.username,
          full_name: foundUser.full_name,
          email: foundUser.email,
          phone_number: foundUser.phone_number,
          address: foundUser.address,
          code: foundUser.code,
          store: {
            store_id: foundUser.store_id,
            code: foundUser.store_code,
            phone_number: foundUser.store_phone_number,
            address: foundUser.store_address,
          },
        },
      };

      return ServiceResponse.success("Login successfully", response, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error during login: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during login.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async register(registerData: EmployeeAccountRequest): Promise<ServiceResponse<LoginResponse | null>> {
    try {
      // Validate input data
      const validatedData = EmployeeRegistrationRequestBodySchema.parse(registerData.body);

      const foundUser = await authRepository.findByUsernameAsync(validatedData.username);
      if (foundUser) {
        return ServiceResponse.failure("Username already exists", null, StatusCodes.CONFLICT);
      }

      const registeredAccount = await authRepository.createEmployeeAccountAsync(registerData);

      const accessToken = this.generateAccessToken({
        userId: registeredAccount.id,
        username: registeredAccount.username,
        role_id: registeredAccount.role_id,
      });

      const response: LoginResponse = {
        token: accessToken,
        user: {
          id: registeredAccount.id,
          username: registeredAccount.username,
          full_name: registeredAccount.full_name,
          email: registeredAccount.email,
          phone_number: registeredAccount.phone_number,
          address: registeredAccount.address,
          code: registeredAccount.code,
          store: {
            store_id: registeredAccount.store_id,
            code: registeredAccount.store_code,
            phone_number: registeredAccount.store_phone_number,
            address: registeredAccount.store_address,
          },
        },
      };

      return ServiceResponse.success("Registration successful", response, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error during registration: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during registration.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyToken(token: string): Promise<ServiceResponse<VerifyTokenResponse | null>> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
      const user = await authRepository.findByUsernameAsync(decoded.username);

      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.UNAUTHORIZED);
      }

      if (!user.is_active) {
        return ServiceResponse.failure("User is inactive", null, StatusCodes.UNAUTHORIZED);
      }

      const response: VerifyTokenResponse = {
        userId: user.id,
        username: user.username,
        iat: decoded.iat,
        exp: decoded.exp,
        role_id: user.role_id,
      };

      return ServiceResponse.success("Token is valid", response, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error verifying token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Invalid token", null, StatusCodes.UNAUTHORIZED);
    }
  }

  async refreshToken(refreshToken: string): Promise<ServiceResponse<RefreshTokenResponse | null>> {
    try {
      // Verify refresh token using jwt.verify() with JWT_SECRET
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as JwtPayload;

      // Verify user still exists and is active
      const user = await authRepository.findByIdAsync(decoded.userId);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.UNAUTHORIZED);
      }

      if (!user.is_active) {
        return ServiceResponse.failure("User is inactive", null, StatusCodes.UNAUTHORIZED);
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken({
        userId: user.id,
        username: user.username,
        role_id: user.role_id,
      });

      const response: RefreshTokenResponse = {
        accessToken: newAccessToken,
      };

      return ServiceResponse.success("Token refreshed successfully", response, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error refreshing token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Invalid refresh token", null, StatusCodes.UNAUTHORIZED);
    }
  }

  private generateAccessToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as SignOptions);
  }

  private generateRefreshToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions);
  }
}

export const adminAuthService = new AdminAuthService();
