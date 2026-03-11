import { ChangePasswordInput, LoginInput, ResetPassword, SignupInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { clearCookie, responseCookie } from "../../core/utils/cookies";
import response from "../../core/utils/response";
import AuthService from "./auth.service";
export class authController {
  static signup = catchAsync(async (req, res) => {
    const input = req.body as SignupInput;
    const data = await AuthService.signupUser(input);
    const { refreshToken, accessToken, userData } = await AuthService.loginUser({
      email: data.email,
      password: input.password,
    });
    responseCookie(res, "refreshToken", refreshToken);
    response(res, { accessToken, userId: userData.id }, 200);
  });
  static login = catchAsync(async (req, res, _next) => {
    const input = req.body as LoginInput;
    const { refreshToken, accessToken, userData } = await AuthService.loginUser(input);
    responseCookie(res, "refreshToken", refreshToken);
    response(res, { accessToken, userId: userData.id }, 200);
  });
  static logout = catchAsync(async (req, res) => {
    clearCookie(res, "refreshToken");
    response(res, { message: "Logged out successfully" }, 200);
  });

  static refreshToken = catchAsync(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    console.log(token);
    if (!token) return next(new appError("Refresh token not found", 404, "NOT_FOUND"));
    const accessToken = await AuthService.getRefreshToken(token);
    return response(res, { accessToken });
  });
  static changePassword = catchAsync(async (req, res, _next) => {
    const input = req.body as ChangePasswordInput;
    const userId = req.user.id;
    await AuthService.changePassword(userId, input);
    clearCookie(res, "refreshToken");
    response(res, { message: "password changed successfully" }, 200);
  });

  static getMyProfile = catchAsync(async (req, res, _next) => {
    const data = await AuthService.getMyProfile(req.user.id);
    response(res, data);
  });
  static forgetPassword = catchAsync(async (req, res, _next) => {
    const email = req.params.email as string;
    const data = await AuthService.forgetPassword(email);
    console.log(data);
    response(res, { message: "Reset Link Send successfully" });
  });
  static resetPassword = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const { password } = req.body as ResetPassword;
    await AuthService.resetPassword({ passwordResetToken: token, password });

    response(res, { message: "Password change successfully" });
  });
}
