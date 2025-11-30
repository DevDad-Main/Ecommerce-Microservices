import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import {
  isAdminAuthenticated,
  isUserAuthenticated,
} from "../middleware/auth.middleware";
import { getAuth } from "@clerk/express";

const mockGetAuth = getAuth as any;

describe("Auth Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe("isUserAuthenticated", () => {
    it("should call next if user is authenticated", async () => {
      mockGetAuth.mockReturnValue({
        userId: "user123",
        isAuthenticated: true,
      } as any);

      await isUserAuthenticated(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockReq.userId).toBe("user123");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 401 if user is not authenticated", async () => {
      mockGetAuth.mockReturnValue({
        userId: null,
        isAuthenticated: false,
      } as any);

      await isUserAuthenticated(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401 }),
      );
    });
  });

  describe("isAdminAuthenticated", () => {
    it("should call next if user is admin", () => {
      mockGetAuth.mockReturnValue({
        userId: "user123",
        sessionClaims: { metadata: { role: "admin" } },
        isAuthenticated: true,
      } as any);

      isAdminAuthenticated(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.userId).toBe("user123");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 401 if user is not authenticated", () => {
      mockGetAuth.mockReturnValue({
        userId: null,
        isAuthenticated: false,
      } as any);

      isAdminAuthenticated(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401 }),
      );
    });

    it("should return 403 if user is not admin", () => {
      mockGetAuth.mockReturnValue({
        userId: "user123",
        sessionClaims: { metadata: { role: "user" } },
        isAuthenticated: true,
      } as any);

      isAdminAuthenticated(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403 }),
      );
    });
  });
});
