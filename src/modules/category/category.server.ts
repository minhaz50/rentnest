import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const getAllCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
};

const createCategory = async (name: string, description?: string) => {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) throw new ApiError(409, "This category already exists.");

  return prisma.category.create({ data: { name, description } });
};

const updateCategory = async (
  id: string,
  data: { name?: string; description?: string },
) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new ApiError(404, "Category not found.");

  return prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new ApiError(404, "Category not found.");

  await prisma.category.delete({ where: { id } });
};

export const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
