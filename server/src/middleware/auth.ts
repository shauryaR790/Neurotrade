import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/auth/jwt.js";
import { db } from "@/database/db.js";
import { HttpError } from "@/utils/asyncHandler.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    userEmail?: string;
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) return header.slice(7);
  // Allow query token for WebSocket upgrades / EventSource (not used here, harmless)
  if (typeof req.query.token === "string") return req.query.token;
  return null;
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) return next();
  const payload = await verifyToken(token);
  if (payload && db.data.users.some((u) => u.id === payload.sub)) {
    req.userId = payload.sub;
    req.userEmail = payload.email;
  }
  next();
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) return next(new HttpError(401, "Authentication required"));
  const payload = await verifyToken(token);
  if (!payload) return next(new HttpError(401, "Invalid or expired token"));
  if (!db.data.users.some((u) => u.id === payload.sub)) {
    return next(new HttpError(401, "User no longer exists"));
  }
  req.userId = payload.sub;
  req.userEmail = payload.email;
  next();
}
