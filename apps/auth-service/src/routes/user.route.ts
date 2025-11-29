import { Router } from "express";
import {
  createClerkUser,
  deleteClerkUserById,
  getClerkUserById,
  getClerkUserList,
} from "../controllers/user.controller";
import { isAdminAuthenticated } from "../middleware/auth.middleware";

const userRouter: Router = Router();

userRouter.use(isAdminAuthenticated);

userRouter.route("/").get(getClerkUserList).post(createClerkUser);

userRouter.route("/:id").get(getClerkUserById).delete(deleteClerkUserById);

export default userRouter;
