import { lookupSchema } from '@org/zod';
import z from 'zod';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { getTenantClient } from '@org/database';

class LookupControllerClass {
  getGroups = catchAsync(async (req, res, _next) => {
    const tenantdb = getTenantClient(req.organization.id);
    const data = await tenantdb.queueGroup.findMany({
      where: { active: true },
      select: { id: true, name: true },
    });
    response(res, data, 200, { schema: z.array(lookupSchema) });
  });
  getQueues = catchAsync(async (req, res, _next) => {
    const tenantdb = getTenantClient(req.organization.id);
    const groupId = req.params.groupId as string;
    const data = await tenantdb.queue.findMany({
      where: { queueGroupId: groupId, active: true },
      select: { id: true, name: true },
    });
    response(res, data, 200, { schema: z.array(lookupSchema) });
  });
  getAgents = catchAsync(async (req, res, _next) => {
    const tenantdb = getTenantClient(req.organization.id);
    const queueId = req.params.queueId as string;
    const data = await tenantdb.queueAgent.findMany({
      where: { queueId, active: true },
      select: { id: true, user: { select: { id: true, name: true } } },
    });
    const output = data.map((item) => ({
      id: item.user?.id,
      name: item.user?.name,
    }));
    response(res, output, 200, { schema: z.array(lookupSchema) });
  });
  getRoles = catchAsync(async (req, res, _next) => {
    const tenantdb = getTenantClient(req.organization.id);
    const data = await tenantdb.role.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
    });
    const output = data.map((item) => ({ id: item.id, name: item.name }));
    response(res, output, 200, { schema: z.array(lookupSchema) });
  });
}

export const LookupController = new LookupControllerClass();
