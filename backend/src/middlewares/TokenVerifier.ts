import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

// Prisma enums might not be exported as runtime types in the generated client;
// declare a local Role type for JWT payload validation.
type Role = "ADMIN" | "BASE_COMMANDER" | "LOGISTICS_PERSONNEL";

interface AppJwtPayload {
  id: string;
  email: string;
  role: Role;
  baseId?: string;
}

export default function TokenVerifier(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        message: "authentication token expired",
        success: false
      });
    }

    const userData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as AppJwtPayload;

    req.userId = userData.id;
    req.email = userData.email;
    req.role = userData.role;
    req.baseId = userData.baseId;

    next();
  } catch (err) {
    return res.status(403).json({
      message: "invalid token",
      success: false
    });
  }
}
