import { tokenSchemaResponse } from '@org/zod';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { TokenService } from './token.service.js';

export class TokenController {
  static getTokenDetails = catchAsync(async (req, res, next) => {
    const data = await TokenService.getTokenDetails(req.params.token as string);
    response(res, data, 200, { schema: tokenSchemaResponse });
  });
}
