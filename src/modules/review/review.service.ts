import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export const createReview = async (
  tenantId: string,
  rentalRequestId: string,
  rating: number,
  comment?: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { review: true },
  });

  if (!rentalRequest) throw new ApiError(404, "Rental request not found.");
  if (rentalRequest.tenantId !== tenantId) {
    throw new ApiError(403, "You can only review your own completed rentals.");
  }
  if (rentalRequest.status !== "COMPLETED") {
    throw new ApiError(400, "You can only review a completed rental.");
  }
  if (rentalRequest.review) {
    throw new ApiError(409, "You have already reviewed this rental.");
  }

  return prisma.review.create({
    data: {
      rentalRequestId,
      propertyId: rentalRequest.propertyId,
      tenantId,
      rating,
      comment,
    },
  });
};
