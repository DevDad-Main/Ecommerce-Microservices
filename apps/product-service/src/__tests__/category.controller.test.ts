import { Request, Response, NextFunction } from "express";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from "../controllers/category.controller";
import { prisma } from "@repo/product-db";

vi.mock("@repo/product-db", () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockPrisma = prisma as any;

describe("Category Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe("createCategory", () => {
    it("should create a category successfully", async () => {
      const mockCategory = {
        id: 1,
        name: "Test Category",
        slug: "test-category",
      };
      mockReq.body = { name: "Test Category", slug: "test-category" };
      mockPrisma.category.create.mockResolvedValue(mockCategory as any);

      await createCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: mockReq.body,
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        product: mockCategory,
        message: "Category Created.",
      });
    });

    it("should return error if category creation fails", async () => {
      mockReq.body = { name: "Test Category", slug: "test-category" };
      mockPrisma.category.create.mockResolvedValue(null as any);

      await createCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Category Not Created",
        }),
      );
    });
  });

  describe("getCategories", () => {
    it("should return categories", async () => {
      const mockCategories = [
        { id: 1, name: "Category 1", slug: "category-1" },
        { id: 2, name: "Category 2", slug: "category-2" },
      ];
      mockPrisma.category.findMany.mockResolvedValue(mockCategories as any);

      await getCategories(mockReq as Request, mockRes as Response, mockNext);

      expect(mockPrisma.category.findMany).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategories);
    });

    it("should return error if no categories found", async () => {
      mockPrisma.category.findMany.mockResolvedValue([] as any);

      await getCategories(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message:
            "Categories Not Found - Categories Must contain at least one category",
        }),
      );
    });
  });

  describe("updateCategory", () => {
    it("should update a category successfully", async () => {
      const mockCategory = {
        id: 1,
        name: "Updated Category",
        slug: "updated-category",
      };
      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Category" };
      mockPrisma.category.update.mockResolvedValue(mockCategory as any);

      await updateCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockPrisma.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockReq.body,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        category: mockCategory,
      });
    });

    it("should return error if id is missing", async () => {
      mockReq.params = {};

      await updateCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Category ID Not Found",
        }),
      );
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category successfully", async () => {
      const mockCategory = { id: 1, name: "Category", slug: "category" };
      mockReq.params = { id: "1" };
      mockPrisma.category.delete.mockResolvedValue(mockCategory as any);

      await deleteCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockPrisma.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Category Deleted",
      });
    });

    it("should return error if id is missing", async () => {
      mockReq.params = {};

      await deleteCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Category ID Not Found",
        }),
      );
    });
  });
});
