import {
  authDetails,
  authPermissions,
  authToken,
  ChangePasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
} from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { clearCookie, responseCookie } from "../../core/utils/cookies";
import response from "../../core/utils/response";
import ForgotPasswordEmail from "../../templates/emails/ForgotPasswordEmail";
import ResetConfirmEmail from "../../templates/emails/ResetConfirmEmail";
import { EmailService } from "../email/email.service";
import AuthService from "./auth.service";
export class authController {
  static signup = catchAsync(async (req, res) => {
    const input = req.body as SignupInput;
    const data = await AuthService.signupUser(input);
    const { refreshToken, accessToken } = await AuthService.loginUser({
      email: data.email,
      password: input.password,
    });
    responseCookie(res, "refreshToken", refreshToken);
    response(res, { accessToken }, 200, { schema: authToken });
  });
  static login = catchAsync(async (req, res, _next) => {
    const input = req.body as LoginInput;
    const { refreshToken, accessToken } = await AuthService.loginUser(input);
    responseCookie(res, "refreshToken", refreshToken);
    response(res, { accessToken }, 200, { schema: authToken });
  });
  static logout = catchAsync(async (req, res) => {
    clearCookie(res, "refreshToken");
    response(res, "Logged out successfully", 200);
  });

  static refreshToken = catchAsync(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) return next(new appError("Refresh token not found", 404, "NOT_FOUND"));
    const accessToken = await AuthService.getRefreshToken(token);
    return response(res, { accessToken }, 200, { schema: authToken });
  });
  static changePassword = catchAsync(async (req, res, _next) => {
    const input = req.body as ChangePasswordInput;
    const userId = req.user.id;
    const data = await AuthService.changePassword(userId, input);
    await EmailService.sendSystemEmail({
      to: data.email,
      subject: "Password changed conformation",
      jsx: ResetConfirmEmail(),
    });
    clearCookie(res, "refreshToken");
    response(res, "password changed successfully");
  });

  static getAuthDetails = catchAsync(async (req, res, _next) => {
    const data = await AuthService.getAuthDetails(req.user.id);
    response(res, data!, 200, { schema: authDetails });
  });
  static getPermissions = catchAsync(async (req, res, _next) => {
    const data = await AuthService.getPermissions(req.user.id, req.organization.id);
    const parsed = authPermissions.parse({ permissions: data });
    response(res, parsed, 200, { schema: authPermissions });
  });
  static forgetPassword = catchAsync(async (req, res, _next) => {
    const email = req.params.email as string;
    const { user, forgetURl } = await AuthService.forgetPassword(email);
    await EmailService.sendSystemEmail({
      to: email,
      subject: "Reset your password",
      jsx: ForgotPasswordEmail({ userName: user.username!, resetLink: forgetURl }),
    });
    response(res, "Reset Link Send successfully");
  });
  static resetPassword = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const { password } = req.body as ResetPasswordInput;
    const data = await AuthService.resetPassword({ passwordResetToken: token, password });
    await EmailService.sendSystemEmail({
      to: data.email,
      subject: "Password changed conformation",
      jsx: ResetConfirmEmail(),
    });
    response(res, "Password change successfully");
  });
}
