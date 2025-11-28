import { clerkClient } from "@clerk/express";
import { catchAsync } from "../utils/catchAsync.utils";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.utils";

//#region GET: Get All Users
export const getClerkUserList = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await clerkClient.users.getUserList();

    return res.status(200).json(users);
  },
);
//#endregion

//#region GET: Get User By ID
export const getClerkUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("User ID is required", 400));
    }
    const users = await clerkClient.users.getUser(id);

    return res.status(200).json(users);
  },
);
//#endregion

//#region POST: Create Clerk User
export const createClerkUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    type CreateParams = Parameters<typeof clerkClient.users.createUser>[0];
    const newUser: CreateParams = req.body;

    const user = await clerkClient.users.createUser(newUser);

    if (!user) {
      return next(new AppError("Failed to creater new Clerk user", 400));
    }

    return res.status(201).json(user);
  },
);
//#endregion

//#region DELETE: Delete User
export const deleteClerkUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("User ID is required", 400));
    }
    const users = await clerkClient.users.deleteUser(id);

    return res.status(200).json(users);
  },
);
//#endregion
