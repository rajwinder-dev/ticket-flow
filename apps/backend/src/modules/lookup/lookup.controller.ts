import { lookupSchema } from "@repo/schemas";
import z from "zod";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";

export class LookupController {
  static getGroups = catchAsync(async (req, res, _next) => {
    const data = await prisma.queueGroup.findMany({
      where: { organizationId: req.organization.id },
      select: { id: true, name: true },
    });
    response(res, data, 200, { schema: z.array(lookupSchema) });
  });
  static getQueues = catchAsync(async (req, res, _next) => {
    const groupId = req.params.groupId as string;
    const data = await prisma.queue.findMany({
      where: { organizationId: req.organization.id, queueGroupId: groupId },
      select: { id: true, name: true },
    });
    response(res, data, 200, { schema: z.array(lookupSchema) });
  });
  static getAgents = catchAsync(async (req, res, _next) => {
    const queueId = req.params.queueId as string;
    const data = await prisma.queueAgent.findMany({
      where: { organizationId: req.organization.id, queueId },
      select: { id: true, user: { select: { id: true, username: true } } },
    });
    const output = data.map((item) => ({ id: item.user?.id, name: item.user?.username }));
    response(res, output, 200, { schema: z.array(lookupSchema) });
  });
}
