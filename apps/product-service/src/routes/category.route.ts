import { Router } from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller";
import { isAdminAuthenticated } from "../middleware/auth.middleware";

const router: Router = Router();

router.use(isAdminAuthenticated);

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").put(updateCategory).delete(deleteCategory);

export default router;
