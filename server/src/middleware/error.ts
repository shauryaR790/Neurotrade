import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "@/utils/asyncHandler.js";
import { logger } from "@/utils/logger.js";
import { isProd } from "@/config.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "ValidationError",
      issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  const e = err as Error;
  logger.error("http", e.message ?? "unknown error", { stack: e.stack });
  return res.status(500).json({
    error: "InternalServerError",
    message: isProd ? "Something went wrong" : e.message,
  });
}
