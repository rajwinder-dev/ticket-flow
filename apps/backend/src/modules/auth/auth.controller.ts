import jwt from "jsonwebtoken";
import { prisma } from "../../core/utils/prismaClient";
import { catchAsync } from "../../core/utils/catchAsync";
import { appError } from "../../core/utils/appError";
import bcrypt from "bcrypt";
import response from "../../core/utils/response";
import { accessTokenExpire, refreshTokenExpire } from "../../config/authConfig";
import HandleFactory from "../../core/utils/handlerFactory";
import { Authorization } from "../../../generated/prisma";
import { authService } from "./auth.service";
import {
  getClientIp,
} from "../../core/helper/generalHelper";
import { clearCookie, responseCookie } from "../../core/utils/cookies";
import { env } from "../../config/env";

export class authController {
  private static handler = new HandleFactory<Authorization>(
    prisma.authorization
  );
  static updatePassword = this.handler.updateOne({
    exclude: ["userId"],
    params: "userId",
  });
  static login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    const userData = await prisma.authorization.findUnique({
      where: { username: username },
    });
    if (userData) {
      const { userId } = userData;
      const sessionId = crypto.randomUUID();
      const verify = await bcrypt.compare(password, userData.password);
      // run when password match
      if (verify) {
        // we generate token
        let accessToken;
        let refreshToken;
        if (env.accessSecret && env.refreshSecret) {
          // *access token used for accessing api
          accessToken = jwt.sign(
            { id: userData.userId, sessionId },
            env.accessSecret,
            { expiresIn: accessTokenExpire }
          );
          // *refresh token used for renew token and put in http cookies
          refreshToken = jwt.sign(
            { id: userData.userId, sessionId },
            env.refreshSecret,
            { expiresIn: refreshTokenExpire }
          );
        }
        // we send this token to headers too
        if (refreshToken)
          responseCookie(res, "refreshToken", refreshToken);
        else console.log("token error");
        // we store user session here
        const clientIp = getClientIp(req);
        authService.storeUserSession({
          sessionId,
          userId: userData.userId,
          clientIp,
        });
        const data = { accessToken, userId: userId };
        return response(res, data, 200);
      }
    }
    return next(new appError("Password or Username is invalid", 401, 'INVALID_CREDENTIALS'));
  });
  static logout = catchAsync(async (req, res, next) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      return next(new appError("No refresh token found", 400,'TOKEN_NOT_FOUND'));
    }

    // 1. Verify and decode refresh token
    let sessionId: string;
    if (env.refreshSecret) {
      try {
        const decoded = jwt.verify(token, env.refreshSecret) as {
          sessionId: string;
        };
        sessionId = decoded?.sessionId;
      } catch {
        return next(new appError("Invalid or expired token", 401, 'INVALID_TOKEN'));
      }
      await authService.updateUserSession(sessionId);
    }

    clearCookie(res, "refreshToken");
    response(res, { message: "Logged out successfully" }, 200);
  });

  static refreshToken = catchAsync(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    // fetch sessionId
    let sessionId: string;
    if (env.refreshSecret) {
      try {
        const decoded = jwt.verify(token, env.refreshSecret) as {
          sessionId: string;
        };
        sessionId = decoded?.sessionId;
      } catch {
        return next(new appError("Invalid or expired token", 401, 'INVALID_TOKEN'));
      }
    }
    if (!token) return res.sendStatus(401);
    if (env.refreshSecret)
      jwt.verify(
        token,
        env.refreshSecret,
        (err: jwt.VerifyErrors | null, decoded: unknown) => {
          if (err) return res.sendStatus(403);
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
              { expiresIn: "30s" }
            );
            return res.json({ accessToken: newAccessToken });
          }
        }
      );
  });
  static changePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return next(new appError("confirm password do not match try again", 400, "PASSWORD_MATCH_ERROR"));
    const userData = await prisma.authorization.findUnique({
      where: { userId: req.user.userId },
      select: { password: true },
    });
    if (!userData) return next(new appError("User do not exist", 404, 'NOT_FOUND'));
    const verify = await bcrypt.compare(currentPassword, userData.password);
    if (!verify)
      return next(new appError("Current password is invalid, try again!", 400, 'INVALID_CREDENTIALS'));

    const hash = await bcrypt.hash(password, 12);
    await prisma.authorization.update({
      where: { userId: req.user.userId },
      data: { password: hash, updatedAt: new Date() },
    });
    if (req.user.sessionId)
      await authService.updateUserSession(req.user.sessionId);

    // 3. Clear the refresh token cookie
    clearCookie(res, "refreshToken");
    response(res, null, 200);
  });
}
