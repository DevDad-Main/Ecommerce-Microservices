import { prisma, Prisma } from "@repo/product-db";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data: Prisma.ProductCreateInput = req.body;

    const product = await prisma.product.create({
      data,
    });

    if (!product) {
      return next(new AppError("Product Not Created", 400));
    }

    return res
      .status(201)
      .json({ success: true, product, message: "Product Created." });
  },
);

export const updateProduct = async (req: Request, res: Response) => {};
export const deleteProduct = async (req: Request, res: Response) => {};
export const getProducts = async (req: Request, res: Response) => {};
export const getProduct = async (req: Request, res: Response) => {};
