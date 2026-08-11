import { CreateRoleInput, UpdateRoleInput } from '@org/zod';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { RoleService } from './role.service.js';
import { getTenantClient } from '@org/database';

export class roleController {
  static createRole = catchAsync(async (req, res, _next) => {
    const input = req.body as CreateRoleInput;
    const data = await RoleService.create(
      req.user.id,
      req.organization.id,
      input,
    );
    response(res, data, 201);
  });
  static getRoleDetails = catchAsync(async (req, res, _next) => {
    const id = req.user.id as string;
    const tenantdb = getTenantClient(req.organization.id);
    const data = await tenantdb.role.findUnique({
      where: { id },
    });
    response(res, data, 200);
  });
  static getAllRoles = catchAsync(async (req, res, _next) => {
    const { data, pagination } = await RoleService.getAllRoles({
      organizationId: req.organization.id,
      queryString: req.query,
    });
    response(res, data, 200, { otherFields: pagination });
  });
  static updateRole = catchAsync(async (req, res, _next) => {
    const input = req.body as UpdateRoleInput;
    const roleId = req.params.id as string;
    const data = await RoleService.update({
      roleId,
      input,
      organizationId: req.organization.id,
      userId: req.user.id,
    });
    response(res, data);
  });
  static deleteRole = catchAsync(async (req, res, _next) => {
    const roleId = req.params.id as string;
    await RoleService.delete({
      roleId,
      organizationId: req.organization.id,
      userId: req.user.id,
    });
    response(res, null, 204);
  });
}
