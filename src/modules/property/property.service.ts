import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreatePropertyInput, PropertyFilters } from "./property.interface";

const getAllProperties = async (filters: PropertyFilters) => {
  const { city, location, type, categoryId, minPrice, maxPrice, bedrooms } =
    filters;

  const page = Math.max(parseInt(filters.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(filters.limit || "10", 10), 1), 50);

  const where: Prisma.PropertyWhereInput = { isAvailable: true };

  if (city) where.city = { contains: city, mode: "insensitive" };
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (type) where.type = type as any;
  if (categoryId) where.categoryId = categoryId;
  if (bedrooms) where.bedrooms = parseInt(bedrooms, 10);
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        category: true,
        landlord: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: { select: { id: true, name: true, email: true, phone: true } },
      reviews: { include: { tenant: { select: { id: true, name: true } } } },
    },
  });

  if (!property) throw new ApiError(404, "Property not found.");
  return property;
};

const createProperty = async (
  landlordId: string,
  input: CreatePropertyInput,
) => {
  const { price, bedrooms, bathrooms, ...rest } = input;

  return prisma.property.create({
    data: {
      ...rest,
      price: Number(price),
      bedrooms: bedrooms !== undefined ? Number(bedrooms) : undefined,
      bathrooms: bathrooms !== undefined ? Number(bathrooms) : undefined,
      amenities: input.amenities || [],
      images: input.images || [],
      landlordId,
    },
  });
};

const findOwnedProperty = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) throw new ApiError(404, "Property not found.");
  if (property.landlordId !== landlordId) {
    throw new ApiError(403, "You do not own this property.");
  }
  return property;
};

const updateProperty = async (
  propertyId: string,
  landlordId: string,
  data: Partial<CreatePropertyInput> & { isAvailable?: boolean },
) => {
  await findOwnedProperty(propertyId, landlordId);
  return prisma.property.update({ where: { id: propertyId }, data });
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
  await findOwnedProperty(propertyId, landlordId);
  await prisma.property.delete({ where: { id: propertyId } });
};

const getMyProperties = async (landlordId: string) => {
  return prisma.property.findMany({
    where: { landlordId },
    include: {
      category: true,
      _count: { select: { rentalRequests: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getAllPropertiesForAdmin = async () => {
  return prisma.property.findMany({
    include: {
      landlord: { select: { id: true, name: true, email: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const propertyService = {
  getAllProperties,
  getMyProperties,
  getPropertyById,
  getAllPropertiesForAdmin,
  deleteProperty,
  updateProperty,
  createProperty,
  findOwnedProperty,
};
