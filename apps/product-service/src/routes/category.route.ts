import { Router } from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";

const router: Router = Router();

router.route("/").get(getCategories).post(createCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
