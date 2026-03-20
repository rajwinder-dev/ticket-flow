/* eslint-disable @typescript-eslint/no-unused-vars */
import { Express } from "express";
declare global {
  namespace Express {
    interface Request {
      user: {
        role?: string;
        id: string;
        email: string;
        sessionId?: string;
        permissions?: Record<string, string[]>;
      };
      organization: {
        id: string,
        isOwner: boolean
      }
      filePaths?: string[];
    }
  }
}
