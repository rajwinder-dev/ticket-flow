import { UpdateMyDetailsInput, userSchemaResponse } from "@repo/schemas";
import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { UserService } from "./user.service";

export class UserController {
  static getMyDetails = catchAsync(async (req, res, _next) => {
    const userId = req.user.id;
    const data = await UserService.getDetails(userId);
    response(res, data, 200, { schema: userSchemaResponse });
  });

  static updateMyDetails = catchAsync(async (req, res, _next) => {
    const input = req.body as UpdateMyDetailsInput;
    const data = await UserService.updateDetails(req.user.id, input);
    response(res, data, 200, { schema: userSchemaResponse });
  });
}
