import { prisma, Prisma } from "@repo/product-db";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

//#region POST: Create Category
export const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data: Prisma.CategoryCreateInput = req.body;

    const category = await prisma.category.create({
      data,
    });

    if (!category) {
      return next(new AppError("Category Not Created", 400));
    }

    return res
      .status(201)
      .json({ success: true, product: category, message: "Category Created." });
  },
);
//#endregion

//#region PUT: Update Category
export const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data: Prisma.CategoryUpdateInput = req.body;

    if (!id) {
      return next(new AppError("Category ID Not Found", 400));
    }

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data,
    });

    if (!category) {
      return next(new AppError("Category Failed To Update", 400));
    }

    return res.status(200).json({
      success: true,
      category,
    });
  },
);
//#endregion

//#region DELETE: Delete Category
export const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("Category ID Not Found", 400));
    }

    const categoryToDelete = await prisma.category.delete({
      where: { id: Number(id) },
    });

    if (!categoryToDelete) {
      return next(new AppError("Category Failed To Delete", 400));
    }

    return res.status(200).json({
      success: true,
      message: "Category Deleted",
    });
  },
);
//#endregion

//#region GET: Get All Categories
export const getCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await prisma.category.findMany();

    if (!categories || categories.length === 0) {
      return next(
        new AppError(
          "Categories Not Found - Categories Must contain at least one category",
          400,
        ),
      );
    }

    return res.status(200).json(categories);
  },
);
//#endregion
