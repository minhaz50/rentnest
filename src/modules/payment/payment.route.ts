import { Router } from "express";
import * as paymentController from "./payment.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/create", paymentController.createPayment);
router.post("/confirm", paymentController.confirmPayment);
router.get("/", paymentController.getMyPayments);
router.get("/:id", paymentController.getPaymentById);

export default router;
