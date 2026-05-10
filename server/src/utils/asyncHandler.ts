import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers and forwards errors to the central error middleware.
 */
export const asyncHandler =
  <T = unknown>(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
