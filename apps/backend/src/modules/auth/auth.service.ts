import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { accessTokenExpire, refreshTokenExpire } from "./auth.constants";
import { env } from "../../config/env";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { ChangePasswordService, LoginService } from "./auth.types";

export default class AuthService {
  static async signupUser() {}
  static async loginUser({ username, password }: LoginService) {
    const userData = await prisma.authorization.findUnique({
      where: { username: username },
    });
    if (!userData) throw new appError("User not found ", 404, "NOT_FOUND");
    const sessionId = crypto.randomUUID();
    const verify = await bcrypt.compare(password, userData.password);
    // run when password match
    if (verify) {
      // we generate token

      if (!env.accessSecret || !env.refreshSecret)
        throw new appError("auth env not defined", 400, "NOT_DEFINED");
      // *access token used for accessing api
      const accessToken = jwt.sign({ id: userData.userId, sessionId }, env.accessSecret, {
        expiresIn: accessTokenExpire,
      });
      // *refresh token used for renew token and put in http cookies
      const refreshToken = jwt.sign({ id: userData.userId, sessionId }, env.refreshSecret, {
        expiresIn: refreshTokenExpire,
      });

      return { accessToken, refreshToken, userData, sessionId };
    }

    throw new appError("Password or Username is invalid", 401, "INVALID_CREDENTIALS");
  }
  static async getRefreshToken(token: string) {
    // fetch sessionId
    let sessionId: string;
    if (!env.refreshSecret) throw new appError("Refresh secret not defined", 400, "SERVER_ERROR");
    try {
      const decoded = jwt.verify(token, env.refreshSecret) as {
        sessionId: string;
      };
      sessionId = decoded?.sessionId;
    } catch {
      throw new appError("Invalid or expired token", 401, "INVALID_TOKEN");
    }

    jwt.verify(token, env.refreshSecret, (err: jwt.VerifyErrors | null, decoded: unknown) => {
      if (env.accessSecret && decoded) {
        const { id } = decoded as {
          id: number;
        };
        const newAccessToken = jwt.sign(
          {
            id,
            sessionId,
          },
          env.accessSecret,
          { expiresIn: "30s" },
        );
        return newAccessToken;
      }
    });
  }
  static async changePassword({
    currentPassword,
    password,
    confirmPassword,
    userId,
  }: ChangePasswordService) {
    if (password !== confirmPassword)
      throw new appError("confirm password do not match try again", 400, "PASSWORD_MATCH_ERROR");
    const userData = await prisma.authorization.findUnique({
      where: { userId },
      select: { password: true },
    });
    if (!userData) throw new appError("User do not exist", 404, "NOT_FOUND");
    const verify = await bcrypt.compare(currentPassword, userData.password);
    if (!verify)
      throw new appError("Current password is invalid, try again!", 400, "INVALID_CREDENTIALS");

    const hash = await bcrypt.hash(password, 12);
    const data = await prisma.authorization.update({
      where: { userId },
      data: { password: hash, updatedAt: new Date() },
    });
    return data;
  }
}
