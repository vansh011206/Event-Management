import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  admin?: any;
  user?: {
    id: string;
  };
}

export const verifyAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const adminToken = req.cookies?.admin_token;
  if (!adminToken) {
    return res.status(401).json({ success: false, error: "Unauthorized. Admin token missing." });
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.NEXTAUTH_SECRET || "fallback_secret");
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Unauthorized. Invalid admin token." });
  }
};

export const verifyUserHeader = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.headers["x-user-id"];
  if (userId) {
    req.user = {
      id: String(userId),
    };
  }
  next();
};
