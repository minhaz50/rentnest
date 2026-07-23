import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const getAllUsers = async (role?: string, status?: string) => {
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

export const userService = {
  getAllUsers,
};
