import { ChangePasswordInput, LoginInput, SignupInput } from "@repo/schemas";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import { env } from "../../config/env";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";
import { BcryptService } from "./bcrypt.service";
import { JwtService } from "./jwt.service";
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
  static async changePassword(userId: string , input: ChangePasswordInput) {
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
    return data;
  }
  static async getMyProfile(userId: string) {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        code: true,
        email: true,
      },
    });
    return data;
  }
  static async forgetPassword(email: string) {
    const data = await prisma.user.findUnique({
      where: { email },
    });
    if (!data) throw new appError("Email not Exist", 404, "NOT_FOUND");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const storeToken = await prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordResetToken,
        passwordResetExpire: addMinutes(new Date(), 10),
      },
    });
    const forgetURl = `${env.coreURL}/reset-password/${storeToken.passwordResetToken}`;
    return forgetURl;
  }
  static async resetPassword({
    passwordResetToken,
    password,
  }: {
    passwordResetToken: string;
    password: string;
  }) {
    const currentDate = new Date();
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken,
        passwordResetExpire: {
          gt: currentDate,
        },
      },
      select: {
        passwordResetExpire: true,
        id: true,
      },
    });
    if (!user) throw new appError("Token Invalid or Expire", 400, "NOT_FOUND");
    const passwordHash = await BcryptService.hashPassword(password);
    const data = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
        passwordChangeAt: new Date(),
        passwordResetExpire: null,
        passwordResetToken: null,
      },
    });
    return data;
  }
}
