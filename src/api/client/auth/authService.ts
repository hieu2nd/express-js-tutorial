import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type {
  CustomerRegistrationRequestBody,
  JwtPayload,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  VerifyTokenResponse,
} from "./authModel";
import { authRepository } from "./authRepository";
export class AuthService {
  private readonly JWT_SECRET: string = env.JWT_SECRET;
  private readonly JWT_EXPIRES_IN: string | number = env.JWT_EXPIRES_IN;
  private readonly REFRESH_TOKEN_EXPIRES_IN: string | number = env.REFRESH_TOKEN_EXPIRES_IN;

  async login(credentials: LoginRequest): Promise<ServiceResponse<LoginResponse | null>> {
    try {
      const foundUser = await authRepository.findByUsernameAsync(credentials.body.username);
      if (!foundUser) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
      }

      const isPasswordValid = await bcrypt.compare(credentials.body.password, foundUser.password);
      if (!isPasswordValid) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
      }

      if (!foundUser.is_active) {
        return ServiceResponse.failure("Account is inactive", null, StatusCodes.UNAUTHORIZED);
      }

      const accessToken = this.generateAccessToken({
        userId: foundUser.id,
        username: foundUser.username,
      });

      return ServiceResponse.success(
        "Login successfully",
        {
          token: accessToken,
          user: {
            id: foundUser.id,
            username: foundUser.username,
            full_name: foundUser.full_name,
            email: foundUser.email,
            phone_number: foundUser.phone_number,
            address: foundUser.address,
            status: foundUser.status,
          },
        },
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error during login: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during login.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async registerCustomer(
    registerData: CustomerRegistrationRequestBody,
  ): Promise<ServiceResponse<LoginResponse | null>> {
    try {
      const foundUser = await authRepository.findByUsernameAsync(registerData.username);
      if (foundUser) return ServiceResponse.failure("Username already exists", null, StatusCodes.CONFLICT);

      const registeredAccount = await authRepository.createCustomerAccountAsync(registerData);
      const accessToken = this.generateAccessToken({
        userId: registeredAccount.id,
        username: registeredAccount.username,
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
          status: registeredAccount.status,
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

      // Find user with all necessary fields from CustomerQueryRow
      const user = await authRepository.findByUsernameAsync(decoded.username);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.UNAUTHORIZED);
      }

      if (!user.is_active) {
        return ServiceResponse.failure("User is inactive", null, StatusCodes.UNAUTHORIZED);
      }

      return ServiceResponse.success(
        "Token is valid",
        {
          userId: user.id,
          username: user.username,
          iat: decoded.iat,
          exp: decoded.exp,
        },
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error verifying token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Invalid token", null, StatusCodes.UNAUTHORIZED);
    }
  }

  async refreshToken(refreshToken: string): Promise<ServiceResponse<{ accessToken: string } | null>> {
    try {
      // TODO: Implement refresh token logic
      // 1. Verify refresh token using jwt.verify() with JWT_SECRET
      // 2. Extract decoded payload (cast to JwtPayload type)
      // 3. Verify user still exists and is active using authRepository.findByIdAsync()
      // 4. Generate new access token using generateAccessToken()
      // 5. Return success response with new access token
      // 6. Handle errors (invalid refresh token, user not found, user inactive)

      throw new Error("RefreshToken method not implemented");
    } catch (ex) {
      const errorMessage = `Error refreshing token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Invalid refresh token", null, StatusCodes.UNAUTHORIZED);
    }
  }

  private generateAccessToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: String(this.JWT_EXPIRES_IN),
    } as SignOptions);
  }

  private generateRefreshToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    // TODO: Implement refresh token generation
    // Use jwt.sign() with payload, JWT_SECRET, and { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    // Cast options as SignOptions if needed for TypeScript compatibility
    throw new Error("GenerateRefreshToken method not implemented");
  }
}

export const authService = new AuthService();
