import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import * as reviewService from "./review.service";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const { rentalRequestId, rating, comment } = req.body;

  if (!rentalRequestId || rating === undefined) {
    throw new ApiError(400, "rentalRequestId and rating are required.");
  }
  const ratingNumber = Number(rating);
  if (ratingNumber < 1 || ratingNumber > 5) {
    throw new ApiError(400, "rating must be between 1 and 5.");
  }

  const review = await reviewService.createReview(
    req.user!.id,
    rentalRequestId,
    ratingNumber,
    comment,
  );
  res.status(201).json({ success: true, data: review });
});
