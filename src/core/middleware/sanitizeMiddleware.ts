import { Request, Response, NextFunction } from "express";
import { sanitizeObject } from "../utils/sanitizer";

export const sanitizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};
