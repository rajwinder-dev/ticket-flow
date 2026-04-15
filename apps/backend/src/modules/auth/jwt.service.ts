import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { accessTokenExpire, refreshTokenExpire } from "./auth.constants.js";
export type TokenType = "access" | "refresh";

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
}
export interface jwtOutput extends JwtPayload {
  iat: number;
  exp: number
}
const config = {
  access: {
    secret: env.accessSecret!,
    expiresIn: accessTokenExpire,
  },
  refresh: {
    secret: env.refreshSecret!,
    expiresIn: refreshTokenExpire,
  },
} as const;
export class JwtService {
  static sign(payload: JwtPayload, type: TokenType) {
    const conf = config[type];

    return jwt.sign(payload, conf.secret, {
      expiresIn: conf.expiresIn,
    });
  }

  static verify(token: string, type: TokenType) {
    const conf = config[type];
    try {
      return jwt.verify(token, conf.secret) as jwtOutput;
    } catch {
      return false;
    }
  }

  static decode(token: string) {
    return jwt.decode(token) as jwtOutput;
  }
}
