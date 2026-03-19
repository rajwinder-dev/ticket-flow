import { OnBoardUserInput, UpdateUserInput } from "@repo/schemas";
import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { UserService } from "./user.service";

export class UserController {
  static onboardUser = catchAsync(async (req, res, _next) => {
    const input = req.body as OnBoardUserInput;
    const data = await UserService.onboardUser(req.user.id, input);
    response(res, data, 201);
  });
  static getMyDetails = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const data = await UserService.getDetails(userId);
    response(res, data, 200);
  });
  static updateMyDetails = catchAsync(async (req, res, _next) => {
    const input = req.body as UpdateUserInput;
    const data = await UserService.updateDetails(req.user.id, input);
    response(res, data, 200);
  });
}
