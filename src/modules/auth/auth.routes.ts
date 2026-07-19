import { Router } from "express";
import { authController } from "./auth.controler";

const router = Router();

router.post("/register", authController.register);

export default router;
