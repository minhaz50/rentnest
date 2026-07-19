import { Router } from "express";
import { authController } from "./auth.controler";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.getMe);

router.patch("/me", authenticate, authController.updateMe);

export default router;
