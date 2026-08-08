import {
  ChangeMemberQueueInput,
  ChangeMemberRoleInput,
  memberSchemaResponse,
} from '@org/zod';
import z from 'zod';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { MemberService } from './member.service.js';

export class MemberController {
  static getMembers = catchAsync(async (req, res, _next) => {
    const queueId = req.query.queueId as string;
    const { data, total, limit, offset } = await MemberService.getMembers({
      organizationId: req.organization.id,
      queueId,
      queryString: req.query,
    });
    response(res, data, 200, {
      otherFields: { limit, offset, total },
      schema: z.array(memberSchemaResponse),
    });
  });
  static updateRole = catchAsync(async (req, res, _next) => {
    const { userId, roleId } = req.params as ChangeMemberRoleInput;
    const data = await MemberService.updateRole({
      userId,
      roleId,
      organizationId: req.organization.id,
    });
    response(res, data);
  });
  static assignQueue = catchAsync(async (req, res, _next) => {
    const { userId, queueId } = req.params as ChangeMemberQueueInput;
    const data = await MemberService.assignQueue({
      userId,
      queueId,
      organizationId: req.organization.id,
    });
    response(res, data);
  });
  static unassignQueue = catchAsync(async (req, res, _next) => {
    const { userId, queueId } = req.params as ChangeMemberQueueInput;
    const data = await MemberService.unassignedQueue({
      userId,
      queueId,
      organizationId: req.organization.id,
    });
    response(res, data);
  });
}
