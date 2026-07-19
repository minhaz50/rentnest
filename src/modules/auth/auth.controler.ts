import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import { authService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email and password are required.");
  }

  const result = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: result });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required.");
  }

  const result = await authService.loginUser(req.body);
  res.status(200).json({ success: true, data: result });
});

export const authController = {
  register,
  login,
};
