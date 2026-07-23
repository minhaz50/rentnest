import { Router } from "express";
import * as reviewController from "./review.controller";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("TENANT"),
  reviewController.createReview,
);

export default router;
