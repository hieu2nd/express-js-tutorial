import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Auth API Endpoints", () => {
  describe("POST /auth/login", () => {
    it("should return validation error for missing fields", async () => {
      // Test missing username and password
      const response = await request(app).post("/auth/login").send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return validation error for invalid username length", async () => {
      // Test username too short
      const response = await request(app).post("/auth/login").send({
        username: "ab",
        password: "password123",
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return validation error for invalid password length", async () => {
      // Test password too short
      const response = await request(app).post("/auth/login").send({
        username: "testuser",
        password: "123",
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should accept valid login request format", async () => {
      // Note: This will fail authentication since we don't have a real user,
      // but should pass validation
      const response = await request(app).post("/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      // Should not be a validation error (400), but might be 401 unauthorized
      expect(response.status).not.toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe("POST /auth/register", () => {
    it("should return validation error for missing required fields", async () => {
      const response = await request(app).post("/auth/register").send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return validation error for invalid email format", async () => {
      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        password: "password123",
        full_name: "Test User",
        email: "invalid-email",
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should accept valid registration request format", async () => {
      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        password: "password123",
        full_name: "Test User",
        email: "test@example.com",
        phone_number: "1234567890",
        address: "123 Test St",
      });

      // Should not be a validation error (400)
      expect(response.status).not.toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe("POST /auth/refresh", () => {
    it("should return validation error for missing refresh token", async () => {
      const response = await request(app).post("/auth/refresh").send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should accept valid refresh token format", async () => {
      const response = await request(app).post("/auth/refresh").send({
        refreshToken: "some.jwt.token",
      });

      // Should not be a validation error (400)
      expect(response.status).not.toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe("POST /auth/verify", () => {
    it("should return error for missing authorization header", async () => {
      const response = await request(app).post("/auth/verify").send({});

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toBe("Authorization header missing");
    });

    it("should return error for malformed authorization header", async () => {
      const response = await request(app).post("/auth/verify").set("Authorization", "InvalidHeader").send({});

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toBe("Token missing");
    });

    it("should accept properly formatted authorization header", async () => {
      const response = await request(app).post("/auth/verify").set("Authorization", "Bearer some.jwt.token").send({});

      // Should not be a format error, but might be invalid token error
      expect(response.status).not.toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
