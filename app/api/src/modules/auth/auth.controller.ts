import { authPermissions } from "@org/zod";
import { catchAsync } from "../../core/utils/catchAsync.js";
import response from "../../core/utils/response.js";
import AuthService from "./auth.service.js";
export class authController {
  static getPermissions = catchAsync(async (req, res, _next) => {
    const data = await AuthService.getPermissions(req.user.id, req.organization.id);
    const parsed = authPermissions.parse({ permissions: data });
    response(res, parsed, 200, { schema: authPermissions });
  });
}
