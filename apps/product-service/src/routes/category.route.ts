import { Router } from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller";
import { isAdminAuthenticated } from "../middleware/auth.middleware";

const router: Router = Router();

router.route("/").get(getCategories).post(isAdminAuthenticated, createCategory);
router
  .route("/:id")
  .put(isAdminAuthenticated, updateCategory)
  .delete(isAdminAuthenticated, deleteCategory);

export default router;
