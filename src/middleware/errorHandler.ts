import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.code === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists.";
  }

  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
