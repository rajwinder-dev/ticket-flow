/* eslint-disable @typescript-eslint/no-unused-vars */
import { Express } from 'express';
import "socket.io";
declare global {
  namespace Express {
    interface Request {
      user: {
        role?: string;
        id: string;
        email: string;
        username: string;
        sessionId?: string;
        permissions?: Record<string, string[]>;
      };
      organization: {
        id: string;
        name: string;
        isOwner: boolean;
      };
      filePaths?: string[];
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}

declare module "socket.io" {
  interface Socket {
    user?: {
      id: string;
      username: string;
      email: string;
    };
  }
}
