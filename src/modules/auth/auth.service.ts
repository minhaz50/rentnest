import { Role } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";
import { RegisterInput, LoginInput } from "./auth.interface";

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  createdAt: true,
};

export const registerUser = async (input: RegisterInput) => {
  const { name, email, password, phone, role } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "This email is already registered.");
  }

  // only tenant/landlord can self-register, admins are created manually
  const finalRole = role === "LANDLORD" ? Role.LANDLORD : Role.TENANT;

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, phone, role: finalRole },
    select: publicUserFields,
  });

  const token = signToken({ id: user.id, role: user.role, email: user.email });

  return { user, token };
};
