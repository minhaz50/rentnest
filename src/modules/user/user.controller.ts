import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import { userService } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, status } = req.query as { role?: string; status?: string };
  const users = await userService.getAllUsers(role, status);
  res.status(200).json({ success: true, data: users });
});

export const userController = {
  getAllUsers,
};
