import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import { propertyService } from "./property.service";

// PUBLIC
export const getAllProperties = catchAsync(
  async (req: Request, res: Response) => {
    const result = await propertyService.getAllProperties(req.query as any);
    res.status(200).json({
      success: true,
      data: result.properties,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  },
);

export const getPropertyById = catchAsync(
  async (req: Request, res: Response) => {
    const property = await propertyService.getPropertyById(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: property });
  },
);

// LANDLORD
export const createProperty = catchAsync(
  async (req: Request, res: Response) => {
    const { title, description, price, location, city, address } = req.body;
    if (!title || !description || !price || !location || !city || !address) {
      throw new ApiError(
        400,
        "title, description, price, location, city and address are required.",
      );
    }

    const property = await propertyService.createProperty(
      req.user!.id,
      req.body,
    );
    res.status(201).json({ success: true, data: property });
  },
);

export const updateProperty = catchAsync(
  async (req: Request, res: Response) => {
    const property = await propertyService.updateProperty(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    res.status(200).json({ success: true, data: property });
  },
);

export const deleteProperty = catchAsync(
  async (req: Request, res: Response) => {
    await propertyService.deleteProperty(req.params.id as string, req.user!.id);
    res.status(200).json({ success: true, message: "Property removed." });
  },
);

export const getMyProperties = catchAsync(
  async (req: Request, res: Response) => {
    const properties = await propertyService.getMyProperties(req.user!.id);
    res.status(200).json({ success: true, data: properties });
  },
);

// ADMIN
export const getAllPropertiesForAdmin = catchAsync(
  async (_req: Request, res: Response) => {
    const properties = await propertyService.getAllPropertiesForAdmin();
    res.status(200).json({ success: true, data: properties });
  },
);
