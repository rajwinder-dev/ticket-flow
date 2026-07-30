import { tokenSchemaResponse } from '@org/zod';
import { appError } from '../../core/utils/appError.js';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { TokenService } from './token.service.js';
import { getTenantClient } from '@org/database';

export class TokenController {
  static getTokenDetails = catchAsync(async (req, res, next) => {
    const token = req.params.token as string;
    const data = await TokenService.verifyToken(token);
    if (!data)
      return next(
        new appError('Link expired or invalid', 404, 'EXPIRED_TOKEN'),
      );
    let role;
    if (data.organizationId && data.roleId) {
      const tenantdb = getTenantClient(data.organizationId);
      const userRole = await tenantdb.role.findUnique({
        where: { id: data.roleId },
      });
      role = userRole?.name;
    }
    const finalResponse = {
      ...data,
      role,
    };
    response(res, finalResponse, 200, { schema: tokenSchemaResponse });
  });
}
