import { Router } from "express";
import * as userController from "./user.controller";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", userController.getAllUsers);
router.patch("/:id/status", userController.updateUserStatus);

export default router;
