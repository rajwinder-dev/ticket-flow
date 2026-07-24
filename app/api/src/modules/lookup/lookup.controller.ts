import { lookupSchema } from "@org/zod";
import z from "zod";
import { catchAsync } from "../../core/utils/catchAsync.js";
import response from "../../core/utils/response.js";
import { prisma } from "@org/database";

class LookupControllerClass {
   getGroups = catchAsync(async (req, res, _next) => {
    const data = await prisma.queueGroup.findMany({
      where: { organizationId: req.organization.id },
      select: { id: true, name: true },
    });
    response(res, data, 200, { schema: z.array(lookupSchema) });
  });
   getQueues = catchAsync(async (req, res, _next) => {
    const groupId = req.params.groupId as string;
    const data = await prisma.queue.findMany({
      where: { organizationId: req.organization.id, queueGroupId: groupId },
      select: { id: true, name: true },
    });
    response(res, data, 200, { schema: z.array(lookupSchema) });
  });
   getAgents = catchAsync(async (req, res, _next) => {
    const queueId = req.params.queueId as string;
    const data = await prisma.queueAgent.findMany({
      where: { organizationId: req.organization.id, queueId },
      select: { id: true, user: { select: { id: true, username: true } } },
    });
    const output = data.map((item) => ({ id: item.user?.id, name: item.user?.username }));
    response(res, output, 200, { schema: z.array(lookupSchema) });
  });
   getRoles = catchAsync(async (req, res, _next) => {
    const data = await prisma.role.findMany({
      where: {
        organizationId: req.organization.id,
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

export const LookupController =  new LookupControllerClass();
