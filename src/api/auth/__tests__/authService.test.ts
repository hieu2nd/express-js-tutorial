import { StatusCodes } from "http-status-codes";
import { describe, expect, it, vi } from "vitest";

import type { Account } from "@/api/auth/authModel";
import { authRepository } from "@/api/auth/authRepository";
import { AuthService } from "@/api/auth/authService";

// Mock the repository
vi.mock("@/api/auth/authRepository", () => ({
  authRepository: {
    findByUsernameAsync: vi.fn(),
    findByIdAsync: vi.fn(),
    createAccountAsync: vi.fn(),
    updateAccountAsync: vi.fn(),
  },
}));

describe("AuthService", () => {
  const authService = new AuthService();
  const mockAccount: Account = {
    id: 1,
    username: "testuser",
    password: "$2b$12$hashedpassword", // bcrypt hash for "password123"
    is_active: 1,
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should return failure for non-existent user", async () => {
      vi.mocked(authRepository.findByUsernameAsync).mockResolvedValue(null);

      const result = await authService.login({
        username: "nonexistent",
        password: "password123",
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(result.message).toBe("Invalid credentials");
    });

    it("should return failure for inactive account", async () => {
      const inactiveAccount = { ...mockAccount, is_active: 0 };
      vi.mocked(authRepository.findByUsernameAsync).mockResolvedValue(inactiveAccount);

      const result = await authService.login({
        username: "testuser",
        password: "password123",
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(result.message).toBe("Account is not activated");
    });

    it("should return failure for wrong password", async () => {
      vi.mocked(authRepository.findByUsernameAsync).mockResolvedValue(mockAccount);

      const result = await authService.login({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(result.message).toBe("Invalid credentials");
    });
  });

  describe("register", () => {
    it("should return failure for existing username", async () => {
      vi.mocked(authRepository.findByUsernameAsync).mockResolvedValue(mockAccount);

      const result = await authService.register({
        username: "testuser",
        password: "password123",
        full_name: "Test User",
        email: "test@example.com",
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.CONFLICT);
      expect(result.message).toBe("Username already exists");
    });

    it("should handle registration errors gracefully", async () => {
      vi.mocked(authRepository.findByUsernameAsync).mockResolvedValue(null);
      vi.mocked(authRepository.createAccountAsync).mockRejectedValue(new Error("Database error"));

      const result = await authService.register({
        username: "newuser",
        password: "password123",
        full_name: "New User",
        email: "new@example.com",
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe("An error occurred during registration.");
    });
  });

  describe("verifyToken", () => {
    it("should return failure for invalid token format", async () => {
      const result = await authService.verifyToken("invalid.token");

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(result.message).toBe("Invalid token");
    });

    it("should return failure for non-existent user", async () => {
      vi.mocked(authRepository.findByIdAsync).mockResolvedValue(null);

      // Create a valid token for testing
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCJ9.invalid";

      const result = await authService.verifyToken(token);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("refreshToken", () => {
    it("should return failure for invalid refresh token", async () => {
      const result = await authService.refreshToken("invalid.refresh.token");

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(result.message).toBe("Invalid refresh token");
    });
  });
});
