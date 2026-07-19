import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export const getAllUsers = async (role?: string, status?: string) => {
  return prisma.user.findMany({
    where: {
      ...(role && { role: role as any }),
      ...(status && { status: status as any }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BANNED",
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found.");
  if (user.role === "ADMIN")
    throw new ApiError(403, "Cannot change status of an admin.");

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};
