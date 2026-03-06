import { ChangePasswordInput, LoginInput } from "@repo/schemas";
import { Authorization } from "../../../generated/prisma";
import { catchAsync } from "../../core/utils/catchAsync";
import { clearCookie, responseCookie } from "../../core/utils/cookies";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import AuthService from "./auth.service";

export class authController {
  private static handler = new HandleFactory<Authorization>(prisma.authorization);
  static signup = catchAsync(async () => {});
  static login = catchAsync(async (req, res) => {
    const input = req.body as LoginInput;
    const { refreshToken, accessToken, userData } =  await AuthService.loginUser(input);
    responseCookie(res, "refreshToken", refreshToken);
    response(res, { accessToken, userId: userData.userId }, 200);
  });
  static logout = catchAsync(async (req, res) => {
    clearCookie(res, "refreshToken");
    response(res, { message: "Logged out successfully" }, 200);
  });

  static refreshToken = catchAsync(async (req, res) => {
    const token = req.cookies.refreshToken;
    const newAccessToken = await AuthService.getRefreshToken(token);
    return res.json({ accessToken: newAccessToken });
  });
  static changePassword = catchAsync(async (req, res) => {
    const input = req.body as ChangePasswordInput;
    const userId = req.user.userId;
    await AuthService.changePassword({ ...input, userId });
    clearCookie(res, "refreshToken");
    response(res, { message: "password changed successfully" }, 200);
  });
  static updatePassword = this.handler.updateOne({
    exclude: ["userId"],
    params: "userId",
  });
}
