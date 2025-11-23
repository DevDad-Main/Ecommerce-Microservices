import { Router } from "express";
import {
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";
import { createProduct, getProducts } from "../controllers/product.controller";

const router: Router = Router();

router.route("/").get(getProducts).post(createProduct);
router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
