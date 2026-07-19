import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "You are not logged in. Please provide a token.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token as string);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new ApiError(401, "This user no longer exists.");
    }

    if (user.status === "BANNED") {
      throw new ApiError(403, "Your account has been banned.");
    }

    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token."));
  }
};

// Restrict route to specific roles, authorize("ADMIN")
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to do this."));
    }
    next();
  };
};
