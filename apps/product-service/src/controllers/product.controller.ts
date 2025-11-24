import { prisma, Prisma } from "@repo/product-db";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

//#region POST: Create Product
export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data: Prisma.ProductCreateInput = req.body;

    const { colors, images } = data;

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return next(new AppError("No Colors Provided", 400));
    }

    if (!images || typeof images !== "object") {
      return next(new AppError("No Images Provided", 400));
    }

    const missingColours = colors.filter((color) => !(color in images));

    if (missingColours.length > 0) {
      return next(
        new AppError(`Missing Images For Colours: ${missingColours}`, 400),
      );
    }

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
//#endregion

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data: Prisma.ProductUpdateInput = req.body;

    if (!id) {
      return next(new AppError("Product ID is required", 400));
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });

    if (!updatedProduct) {
      return next(new AppError("Product Not Updated", 400));
    }

    return res.status(200).json({ success: true, product: updatedProduct });
  },
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("Product ID is required", 400));
    }

    const productToDelete = await prisma.product.delete({
      where: { id: Number(id) },
    });

    if (!productToDelete) {
      return next(new AppError("Product Failed To Delete", 400));
    }

    return res.status(200).json({ success: true, message: "Product Deleted" });
  },
);

//#region GET: Get All Products
export const getProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sort, category, search, limit } = req.query;

    //NOTE: Use an IIFE to sort out data befoer passing it to prisma
    const orderBy = (() => {
      switch (sort) {
        case "asc":
          return { price: Prisma.SortOrder.asc };

        case "desc":
          return { price: Prisma.SortOrder.desc };

        case "oldest":
          return { createdAt: Prisma.SortOrder.asc };

        default:
          return { createdAt: Prisma.SortOrder.desc };
      }
    })();

    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: category as string,
        },
        name: {
          contains: search as string,
          // Disregards case sensitivity
          mode: "insensitive",
        },
      },
      orderBy,
      take: limit ? Number(limit) : undefined, // Undefined = No limit
    });

    if (!products || products.length === 0) {
      return next(new AppError("Products Not Found", 404));
    }

    return res.status(200).json({ success: true, products });
  },
);
//#endregion

//#region GET: Get Product By ID
export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("Product ID is required", 400));
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return next(new AppError("Product Not Found", 404));
    }

    return res.status(200).json({ success: true, product });
  },
);
//#endregion
