import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import { categoryService } from "./category.server";

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({ success: true, data: categories });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) throw new ApiError(400, "name is required.");

  const category = await categoryService.createCategory(name, description);
  res.status(201).json({ success: true, data: category });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await categoryService.updateCategory(id as string, req.body);
  res.status(200).json({ success: true, data: category });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await categoryService.deleteCategory(id as string);
  res.status(200).json({ success: true, message: "Category deleted." });
});

export const categoryController = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
