import { Router } from "express";
import * as rentalController from "./rental.controller";
import { authenticate, authorize } from "../../middleware/auth";

export const rentalRouter = Router();
rentalRouter.use(authenticate);
rentalRouter.post(
  "/",
  authorize("TENANT"),
  rentalController.createRentalRequest,
);
rentalRouter.get(
  "/",
  authorize("TENANT"),
  rentalController.getMyRentalRequests,
);
rentalRouter.get("/:id", rentalController.getRentalRequestById);

export const landlordRentalRouter = Router();
landlordRentalRouter.use(authenticate, authorize("LANDLORD"));
landlordRentalRouter.get("/", rentalController.getLandlordRequests);

export const adminRentalRouter = Router();
adminRentalRouter.use(authenticate, authorize("ADMIN"));
