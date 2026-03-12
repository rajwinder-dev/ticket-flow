import { OnBoardUserInput } from "@repo/schemas";
import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { UserService } from "./user.service";

export class UserController {
  static onboardUser = catchAsync(async (req, res, _next) => {
    const input = req.body as OnBoardUserInput
    const data = await UserService.onboardUser(req.user.id, input);
    response(res, data, 201);
  });
}
