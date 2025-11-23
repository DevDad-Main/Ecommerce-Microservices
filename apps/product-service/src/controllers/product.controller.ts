import { Prisma } from "@repo/product-db";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data: Prisma.ProductCreateInput = req.body;
  },
);

export const updateProduct = async (req: Request, res: Response) => {};
export const deleteProduct = async (req: Request, res: Response) => {};
export const getProducts = async (req: Request, res: Response) => {};
export const getProduct = async (req: Request, res: Response) => {};
