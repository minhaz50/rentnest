import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.route";
import categoryRoutes from "./modules/category/category.route";
import {
  publicPropertyRouter,
  landlordPropertyRouter,
  adminPropertyRouter,
} from "./modules/property/property.route";
import {
  rentalRouter,
  landlordRentalRouter,
  adminRentalRouter,
} from "./modules/rental/rental.route";
import paymentRoutes from "./modules/payment/payment.route";
import { stripeWebhook } from "./modules/payment/payment.controller";
import reviewRoutes from "./modules/review/review.routes";

import { notFound, errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));

app.post(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Welcome to the RentNest API 🏠" });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", publicPropertyRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/rentals", rentalRouter);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// landlord
app.use("/api/landlord/properties", landlordPropertyRouter);
app.use("/api/landlord/requests", landlordRentalRouter);

// admin-only routes
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/properties", adminPropertyRouter);
app.use("/api/admin/rentals", adminRentalRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
