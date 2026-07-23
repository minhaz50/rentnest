import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import { userService } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, status } = req.query as { role?: string; status?: string };
  const users = await userService.getAllUsers(role, status);
  res.status(200).json({ success: true, data: users });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["ACTIVE", "BANNED"].includes(status)) {
    throw new ApiError(400, "status must be ACTIVE or BANNED.");
  }

  const user = await userService.updateUserStatus(id as string, status);
  res.status(200).json({ success: true, data: user });
});

export const userController = {
  getAllUsers,
  updateUserStatus,
};
