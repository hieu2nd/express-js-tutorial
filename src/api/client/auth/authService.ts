import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import bcrypt from "bcryptjs";
import jwt, { sign } from "jsonwebtoken";
import type { AuthResponse, CustomerAccountRequest, JwtPayload, LoginRequest } from "./authModel";
import { authRepository } from "./authRepository";
export class AuthService {
  private readonly JWT_SECRET: string = env.JWT_SECRET;
  private readonly JWT_EXPIRES_IN: string | number = env.JWT_EXPIRES_IN;
  private readonly REFRESH_TOKEN_EXPIRES_IN: string | number = env.REFRESH_TOKEN_EXPIRES_IN;

  async login(credentials: LoginRequest): Promise<ServiceResponse<AuthResponse | null>> {
    try {
      // TODO: Implement login logic
      // 1. Extract username and password from credentials
      // 2. Find account by username using authRepository.findByUsernameAsync()
      // 3. Check if account exists (return "Invalid credentials" if not)
      // 4. Check if account is active (is_active = 1)
      // 5. Verify password using bcrypt.compare()
      // 6. Generate access token and refresh token using private methods
      // 7. Return success response with token and user info
      // 8. Handle errors and return appropriate failure responses
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
      // const refreshToken = this.generateRefreshToken({
      //   userId: foundUser.id,
      //   username: foundUser.username
      // })
      return ServiceResponse.success(
        "Login successfully",
        {
          token: accessToken,
          user: {
            id: foundUser.id,
            username: foundUser.username,
            full_name: foundUser.full_name,
            email: foundUser.email,
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

  async registerCustomer(registerData: CustomerAccountRequest): Promise<ServiceResponse<AuthResponse | null>> {
    try {
      // TODO: Implement registration logic
      // 1. Extract user data from userData parameter
      // 2. Check if username already exists using authRepository.findByUsernameAsync()
      // 3. Hash the password using bcrypt.hash() with salt rounds of 12
      // 4. Create account data object with hashed password, is_active: 1, is_deleted: false
      // 5. Create account using authRepository.createAccountAsync()
      // 6. TODO: Create corresponding user record in user table (requires transaction)
      // 7. Generate access token using private method
      // 8. Return success response with token and user info
      // 9. Handle errors (username exists = CONFLICT, other errors = INTERNAL_SERVER_ERROR)

      const foundUser = await authRepository.findByUsernameAsync(registerData.body.username);
      if (foundUser) return ServiceResponse.failure("Username already exists", null, StatusCodes.CONFLICT);
      const registeredAccount = await authRepository.createCustomerAccountAsync(registerData);
      const accessToken = this.generateAccessToken({
        userId: registeredAccount.id,
        username: registerData.body.username,
      });
      const response: AuthResponse = {
        token: accessToken,
        user: {
          id: registeredAccount.id,
          username: registeredAccount.username,
          full_name: registeredAccount.full_name,
          email: registeredAccount.email,
        },
      };
      return ServiceResponse.success("Registration successful", response, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error during registration: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred during registration.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyToken(token: string): Promise<ServiceResponse<JwtPayload | null>> {
    try {
      // TODO: Implement token verification
      // 1. Verify JWT token using jwt.verify() with JWT_SECRET
      // 2. Extract decoded payload (cast to JwtPayload type)
      // 3. Verify user still exists and is active using authRepository.findByIdAsync()
      // 4. Return success response with decoded payload
      // 5. Handle errors (invalid token, user not found, user inactive)
      const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
      const user = await authRepository.findByIdAsync(decoded.userId);
      console.log(user, "user");
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
    // TODO: Implement access token generation
    // Use jwt.sign() with payload, JWT_SECRET, and { expiresIn: JWT_EXPIRES_IN }
    // Cast options as SignOptions if needed for TypeScript compatibility
    return jwt.sign(payload, this.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: this.JWT_EXPIRES_IN as string | number,
    });
  }

  private generateRefreshToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    // TODO: Implement refresh token generation
    // Use jwt.sign() with payload, JWT_SECRET, and { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    // Cast options as SignOptions if needed for TypeScript compatibility
    throw new Error("GenerateRefreshToken method not implemented");
  }
}

export const authService = new AuthService();
