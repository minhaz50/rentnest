import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreateRentalRequestInput, RentalStatus } from "./rental.interface";

const ALLOWED_TRANSITIONS: Record<string, RentalStatus[]> = {
  PENDING: ["APPROVED", "REJECTED"],
  ACTIVE: ["COMPLETED"],
};

export const createRentalRequest = async (
  tenantId: string,
  input: CreateRentalRequestInput,
) => {
  const { propertyId, moveInDate, message } = input;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) throw new ApiError(404, "Property not found.");
  if (!property.isAvailable)
    throw new ApiError(400, "This property is not available.");
  if (property.landlordId === tenantId) {
    throw new ApiError(400, "You cannot request your own property.");
  }

  const existingActiveRequest = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId,
      status: { in: ["PENDING", "APPROVED", "ACTIVE"] },
    },
  });
  if (existingActiveRequest) {
    throw new ApiError(
      409,
      "You already have an active request for this property.",
    );
  }

  return prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
      moveInDate: moveInDate ? new Date(moveInDate) : undefined,
      message,
    },
  });
};

export const getMyRentalRequests = async (
  tenantId: string,
  status?: string,
) => {
  return prisma.rentalRequest.findMany({
    where: { tenantId, ...(status && { status: status as any }) },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          price: true,
          images: true,
        },
      },
      payment: true,
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getRentalRequestById = async (
  id: string,
  userId: string,
  role: string,
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true, phone: true } },
      payment: true,
      review: true,
    },
  });

  if (!request) throw new ApiError(404, "Rental request not found.");

  const isTenant = request.tenantId === userId;
  const isLandlord = request.property.landlordId === userId;
  if (!isTenant && !isLandlord && role !== "ADMIN") {
    throw new ApiError(403, "You do not have access to this rental request.");
  }

  return request;
};

export const getLandlordRequests = async (
  landlordId: string,
  status?: string,
) => {
  return prisma.rentalRequest.findMany({
    where: {
      property: { landlordId },
      ...(status && { status: status as any }),
    },
    include: {
      tenant: { select: { id: true, name: true, email: true, phone: true } },
      property: { select: { id: true, title: true, city: true, price: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
