import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { isAdminAuthenticated } from "../middleware/auth.middleware";

const router: Router = Router();

router.route("/").get(getProducts).post(createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(isAdminAuthenticated, updateProduct)
  .delete(isAdminAuthenticated, deleteProduct);

export default router;
