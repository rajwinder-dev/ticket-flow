import { tokenSchemaResponse } from "@org/zod";
import { appError } from "../../core/utils/appError.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import response from "../../core/utils/response.js";
import { TokenService } from "./token.service.js";

export class TokenController {
  static getTokenDetails = catchAsync(async (req, res, next) => {
    const token = req.params.token as string;
    const data = await TokenService.verifyToken(token);
    if (!data) return next(new appError("Link expired or invalid", 404, "EXPIRED_TOKEN"));
    const finalResponse = {
      ...data,
      role: data.role?.name,
    };
    response(res, finalResponse, 200, { schema: tokenSchemaResponse });
  });
}
