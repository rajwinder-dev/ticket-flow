import { CreateRoleInput, UpdateRoleInput } from '@org/zod';
import { appError } from '../../core/utils/appError.js';
import { readableId } from '../../core/utils/utils.js';
import { ActivityService } from '../activity/activity.service.js';
import { getTenantClient } from '@org/database';
import { ParsedQs } from 'qs';
import { APIFeatures } from '../../core/utils/apiFeatures.js';

export class RoleService {
  static getAllRoles = async ({
    organizationId,
    queryString,
  }: {
    organizationId: string;
    queryString: ParsedQs;
  }) => {
    const tenantdb = getTenantClient(organizationId);
    const { filterOptions, limit, offset } = new APIFeatures(
      queryString,
    ).pagination();
    const data = await tenantdb.role.findMany({
      where: {
        organizationId,
        active: true,
        isSystem: false,
        ...filterOptions.where,
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        permissions: true,
      },
      skip: offset,
      take: limit,
    });
    const total = await tenantdb.role.count({
      where: {
        organizationId,
        active: true,
        isSystem: false,
        ...filterOptions.where,
      },
    });
    return { data, pagination: { limit, offset, total } };
  };
  static create = async (
    userId: string,
    organizationId: string,
    input: CreateRoleInput,
  ) => {
    const tenentDb = getTenantClient(organizationId);
    const role = await tenentDb.role.create({
      data: {
        ...input,
        code: readableId('ROL'),
        organizationId,
        createdBy: userId,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'role is created ',
      event: 'role.create',
      entityId: role.id,
      entityType: 'ROLE',
    });
    return role;
  };
  static update = async ({
    roleId,
    organizationId,
    input,
    userId,
  }: {
    roleId: string;
    input: UpdateRoleInput;
    userId: string;
    organizationId: string;
  }) => {
    const tenentDb = getTenantClient(organizationId);
    const existingRole = await tenentDb.role.findUnique({
      where: { id: roleId },
    });
    const updatedRole = await tenentDb.role.update({
      data: input,
      where: {
        id: roleId,
        organizationId,
        isSystem: false,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'role is updated ',
      event: 'role.update',
      entityId: roleId,
      oldData: existingRole,
      newData: updatedRole,
      entityType: 'ROLE',
    });
    return updatedRole;
  };
  static delete = async ({
    roleId,
    organizationId,
    userId,
  }: {
    roleId: string;
    organizationId: string;
    userId: string;
  }) => {
    const tenentDb = getTenantClient(organizationId);
    const existingRole = await tenentDb.role.findUnique({
      where: {
        id: roleId,
        isSystem: false,
      },
      select: {
        active: true,
      },
    });
    if (!existingRole) throw new appError('Role not found ', 404, 'NOT_FOUND');
    if (!existingRole.active)
      throw new appError('Role Already deleted', 409, 'CONFLICT_ERROR');
    const userCount = await tenentDb.membership.count({
      where: {
        roleId,
      },
    });
    if (userCount > 0)
      throw new appError(
        'users are already assigned to this role',
        409,
        'CONFLICT_ERROR',
      );
    const updatedRole = await tenentDb.role.update({
      data: {
        active: false,
      },
      where: {
        id: roleId,
        organizationId,
        isSystem: false,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'role is updated ',
      event: 'role.update',
      entityId: roleId,
      oldData: existingRole,
      newData: updatedRole,
      entityType: 'ROLE',
    });
    return updatedRole;
  };
}
