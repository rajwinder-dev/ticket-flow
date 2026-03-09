import bcrypt from "bcrypt";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";
import { ChangePasswordService, LoginService, SignupService } from "./auth.types";
import { JwtService } from "./jwt.service";
import { BcryptService } from "./bcrypt.service";

export default class AuthService {
  static async signupUser({ password, email, name }: SignupService) {
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
        name,
        email,
        passwordHash,
        userType: "ADMIN",
      },
    });
    return data;
  }
  static async loginUser({ email, password }: LoginService) {
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
  static async changePassword({
    currentPassword,
    password,
    confirmPassword,
    userId,
  }: ChangePasswordService) {
    if (password !== confirmPassword)
      throw new appError("confirm password do not match try again", 400, "PASSWORD_MATCH_ERROR");
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });
    if (!userData) throw new appError("User do not exist", 404, "NOT_FOUND");
    const verify = await bcrypt.compare(currentPassword, userData.passwordHash);
    if (!verify)
      throw new appError("Current password is invalid, try again!", 400, "INVALID_CREDENTIALS");

    const hash = await bcrypt.hash(password, 12);
    const data = await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash, updatedAt: new Date() },
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
        userType: true,
        email: true,
        role: {
          select: {
            name: true,
            permissions: true,
          },
        },
      },
    });
    return data;
  }
}
