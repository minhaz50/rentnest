import { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", userController.getAllUsers);

router.patch("/:id", userController.updateUserStatus);

export default router;
