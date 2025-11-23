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
      .json({ success: true, product: category, message: "Product Created." });
  },
);
//#endregion

export const updateCategory = async (req: Request, res: Response) => {};
export const deleteCategory = async (req: Request, res: Response) => {};
export const getCategories = async (req: Request, res: Response) => {};
export const getCategory = async (req: Request, res: Response) => {};
