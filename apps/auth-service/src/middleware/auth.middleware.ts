import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { AppError } from "../utils/AppError.utils";
import type { CustomJwtSessionClaims } from "@repo/types";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const isUserAuthenticated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
      return next(new AppError("You are not logged in", 401));
    }

    req.userId = userId;

    return next();
  },
);

export const isAdminAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    return next(new AppError("You are not logged in", 401));
  }

  const claims = auth.sessionClaims as CustomJwtSessionClaims;

  if (claims.metadata?.role !== "admin") {
    return res
      .status(403)
      .send({ message: "Unauthorized, You do not have the required role." });
  }

  req.userId = auth.userId;
};
