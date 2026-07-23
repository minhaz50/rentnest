import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import * as rentalService from "./rental.service";

export const createRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { propertyId } = req.body;
    if (!propertyId) throw new ApiError(400, "propertyId is required.");

    const request = await rentalService.createRentalRequest(
      req.user!.id,
      req.body,
    );
    res.status(201).json({ success: true, data: request });
  },
);

export const getMyRentalRequests = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.query as { status?: string };
    const requests = await rentalService.getMyRentalRequests(
      req.user!.id,
      status,
    );
    res.status(200).json({ success: true, data: requests });
  },
);

export const getRentalRequestById = catchAsync(
  async (req: Request, res: Response) => {
    const request = await rentalService.getRentalRequestById(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
    );
    res.status(200).json({ success: true, data: request });
  },
);

export const getLandlordRequests = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.query as { status?: string };
    const requests = await rentalService.getLandlordRequests(
      req.user!.id,
      status,
    );
    res.status(200).json({ success: true, data: requests });
  },
);
export const updateRentalStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    if (!status) throw new ApiError(400, "status is required.");

    const request = await rentalService.updateRentalStatus(
      req.params.id as string,
      req.user!.id,
      status,
    );
    res.status(200).json({ success: true, data: request });
  },
);

export const getAllRentalRequests = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.query as { status?: string };
    const requests = await rentalService.getAllRentalRequests(status);
    res.status(200).json({ success: true, data: requests });
  },
);
