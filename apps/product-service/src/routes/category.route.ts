import { Router } from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller";

const router: Router = Router();

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").put(updateCategory).delete(deleteCategory);

export default router;
