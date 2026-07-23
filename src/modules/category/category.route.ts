import { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth";
import { categoryController } from "./category.controller";

const router = Router();

// public
router.get("/", categoryController.getAllCategories);

// admin only
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  categoryController.createCategory,
);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.deleteCategory,
);

export default router;
