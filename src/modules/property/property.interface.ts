import { PropertyType } from "../../generated/prisma/client";

export interface CreatePropertyInput {
  title: string;
  description: string;
  type?: PropertyType;
  price: number;
  location: string;
  city: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  images?: string[];
  categoryId?: string;
}

export interface PropertyFilters {
  city?: string;
  location?: string;
  type?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  page?: string;
  limit?: string;
}
