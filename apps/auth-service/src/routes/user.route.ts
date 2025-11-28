import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { clerkClient } from "../utils/clerk.utils";
import {
  createClerkUser,
  getClerkUserById,
  getClerkUserList,
} from "../controllers/user.controller";
import { isAdminAuthenticated } from "../middleware/auth.middleware";

const userRouter: Router = Router();

userRouter.use(isAdminAuthenticated);

userRouter.route("/").get(getClerkUserList).post(createClerkUser);

userRouter.route("/:id").get(getClerkUserById).delete();

export default userRouter;
