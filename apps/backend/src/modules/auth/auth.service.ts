import { ChangePasswordInput, LoginInput, SignupInput } from "@repo/schemas";
import bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import { env } from "../../config/env.js";
import { appError } from "../../core/utils/appError.js";
import { prisma } from "../../core/utils/prismaClient.js";
import { readableId } from "../../core/utils/utils.js";
import { ActivityService } from "../activity/activity.service.js";
import { TokenService } from "../token/token.service.js";
import { BcryptService } from "./bcrypt.service.js";
import { JwtService } from "./jwt.service.js";
export default class AuthService {
  static async signupUser({ password, email, username }: SignupInput) {
    const passwordHash = await BcryptService.hashPassword(password);
    const exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (exist) throw new appError("User already exist ", 409, "CONFLICT_ERROR");
    const data = await prisma.user.create({
      data: {
        code: readableId("USR"),
        email,
        username,
        passwordHash,
      },
    });
    await ActivityService.lagActivity({
      actorId: data.id,
      actorType: "USER",
      message: "user signup successfully",
      event: "user.signup",
      entityType: "AUTH",
      entityId: data.id,
    });
    return data;
  }
  static async loginUser({ email, password }: LoginInput) {
    const userData = await prisma.user.findUnique({
      where: { email: email },
      select: {
        passwordHash: true,
        id: true,
      },
    });
    if (!userData) throw new appError("User not found ", 404, "NOT_FOUND");
    const verify = await BcryptService.verifyPassword(password, userData.passwordHash);
    if (!verify) throw new appError("Password or Username is invalid", 401, "INVALID_CREDENTIALS");
    const accessToken = JwtService.sign({ userId: userData.id, email }, "access");
    const refreshToken = JwtService.sign({ userId: userData.id, email }, "refresh");
    await ActivityService.lagActivity({
      actorId: userData.id,
      actorType: "USER",
      message: "user logged In successfully",
      event: "user.signup",
      entityType: "AUTH",
    });
    return { accessToken, refreshToken, userData };
  }
  static async getRefreshToken(token: string) {
    const decoded = JwtService.verify(token, "refresh");

    if (!decoded) throw new appError("Invalid or Expire token", 401, "INVALID_TOKEN");
    const newAccessToken = JwtService.sign(
      { userId: decoded.userId, email: decoded.email },
      "access",
    );
    return newAccessToken;
  }
  static async changePassword(userId: string, input: ChangePasswordInput) {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });
    if (!userData) throw new appError("User do not exist", 404, "NOT_FOUND");
    const verify = await bcrypt.compare(input.currentPassword, userData.passwordHash);
    if (!verify)
      throw new appError("Current password invalid, try again!", 400, "INVALID_CREDENTIALS");

    const hash = await BcryptService.hashPassword(input.password);
    const data = await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash, passwordChangeAt: new Date() },
    });
    await ActivityService.lagActivity({
      actorId: userId,
      actorType: "USER",
      message: "user changed password successfully",
      event: "user.changePassword",
      entityType: "AUTH",
    });
    return data;
  }
  static async getAuthDetails(userId: string,) {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true
      },
    });
     ;
    return userData;
  }
    static async getPermissions(userId: string, organizationId: string) {
      const permissions = await prisma.membership.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
        include: {
          role: true,
        },
      });
    return {permissions: permissions?.role?.permissions};
  }
  static async forgetPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new appError("Email not Exist", 404, "NOT_FOUND");
    const { token } = await TokenService.createToken({
      input: {
        email,
        type: "RESET_PASSWORD",
        userId: user.id,
        createdBy: user.id,
      },
      expiresAt: addMinutes(new Date(), 10),
    });
    await ActivityService.lagActivity({
      actorId: user.id,
      actorType: "USER",
      message: "user request password reset link",
      event: "user.changePassword",
      entityType: "AUTH",
    });
    const forgetURl = `${env.coreURL}/reset-password/${token}`;
    return { user, forgetURl };
  }
  static async resetPassword({
    passwordResetToken,
    password,
  }: {
    passwordResetToken: string;
    password: string;
  }) {
    const token = await TokenService.verifyToken(passwordResetToken);
    if (!token?.userId)
      throw new appError("Password reset link Invalid or Expire", 400, "INVALID_TOKEN");
    const passwordHash = await BcryptService.hashPassword(password);
    const data = await prisma.user.update({
      where: {
        id: token.userId,
      },
      data: {
        passwordHash,
        passwordChangeAt: new Date(),
      },
    });
    await TokenService.updateTokenStatus(passwordResetToken, "USED");
    await ActivityService.lagActivity({
      actorId: data.id,
      actorType: "USER",
      message: "user reset password",
      event: "user.resetPassword",
      entityType: "AUTH",
    });
    return data;
  }
}
