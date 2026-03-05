/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user: { role?: string; userId: string, sessionId?:string };
      filePaths?: string[];
    }
  }
}
