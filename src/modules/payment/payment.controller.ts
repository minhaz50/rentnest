import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import { paymentService } from "./payment.service";

export const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { rentalRequestId, provider } = req.body;
  if (!rentalRequestId || !provider) {
    throw new ApiError(400, "rentalRequestId and provider are required.");
  }
  if (!["STRIPE"].includes(provider)) {
    throw new ApiError(400, "provider must be STRIPE or SSLCOMMERZ.");
  }

  const result = await paymentService.createPayment(
    req.user!.id,
    rentalRequestId,
    provider,
  );
  res.status(201).json({ success: true, data: result });
});

export const confirmPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { transactionId } = req.body;
    if (!transactionId) throw new ApiError(400, "transactionId is required.");

    const payment = await paymentService.confirmPayment(transactionId);
    res.status(200).json({ success: true, data: payment });
  },
);

export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  await paymentService.handleStripeWebhook(req.body as Buffer, signature);
  res.status(200).json({ received: true });
});

export const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const payments = await paymentService.getMyPayments(req.user!.id);
  res.status(200).json({ success: true, data: payments });
});

export const getPaymentById = catchAsync(
  async (req: Request, res: Response) => {
    const payment = await paymentService.getPaymentById(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
    );
    res.status(200).json({ success: true, data: payment });
  },
);
