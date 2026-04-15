import {
  AddAgentsToQueueInput,
  CreateQueueInput,
  queueSchemaResponse,
  RemoveAgentsFromQueueInput,
  UpdateQueueInput,
} from "@repo/schemas";
import z from "zod";
import { APIFeatures } from "../../core/utils/apiFeatures.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import { prisma } from "../../core/utils/prismaClient.js";
import response from "../../core/utils/response.js";
import { QueueService } from "./queue.service.js";

export class QueueController {
  static createQueue = catchAsync(async (req, res, _next) => {
    const groupId = req.params.id as string;
    const input = req.body as CreateQueueInput;
    const queue = await QueueService.create({
      organizationId: req.organization.id,
      queueGroupId: groupId,
      input,
      userId: req.user.id,
    });
    response(res, queue, 201);
  });
  static getQueueDetails = catchAsync(async (req, res, _next) => {
    const queueId = req.params.id as string;
    const data = await QueueService.getDetails({ queueId, organizationId: req.organization.id });
    response(res, data);
  });
  static getQueueSummary = catchAsync(async (req, res, _next) => {
    const queueId = req.params.id as string;
    const data = await QueueService.getQueueSummary({
      queueId,
      organizationId: req.organization.id,
    });
    response(res, data);
  });
  static addAgents = catchAsync(async (req, res, _next) => {
    const queueId = req.params.id as string;
    const { agentIds } = req.body as AddAgentsToQueueInput;
    const data = await QueueService.addAgents({
      queueId,
      organizationId: req.organization.id,
      agentIds,
      userId: req.user.id,
    });
    response(res, data, 200);
  });
  static removeAgents = catchAsync(async (req, res, _next) => {
    const queueId = req.params.id as string;
    const { agentIds } = req.body.agentIds as RemoveAgentsFromQueueInput;
    await QueueService.removeAgents({
      queueId,
      organizationId: req.organization.id,
      agentIds,
      userId: req.user.id,
    });
    response(res, null, 204);
  });
  static getQueues = catchAsync(async (req, res, _next) => {
    const groupId = req.params.id as string;
    const { filterOptions, limit, offset } = new APIFeatures(req.query)
      .filter()
      .limitFields()
      .pagination();
    const queues = await prisma.queue.findMany({
      where: {
        organizationId: req.organization.id,
        queueGroupId: groupId,
        ...filterOptions.where,
        active: true,
      },
      select: {
        name: true,
        description: true,
        order: true,
        createdAt: true,
        id: true,
        _count: {
          select: {
            queueAgents: true,
          },
        },
        queueAgents: {
          select: {
            ticketCount: true,
          },
        },
      },

      orderBy: {
        order: "asc",
      },
      skip: offset,
      take: limit,
    });
    const total = await prisma.queue.count({
      where: {
        organizationId: req.organization.id,
        queueGroupId: groupId,
        ...filterOptions.where,
        active: true,
      },
    });
    const result = queues.map((queue) => ({
      id: queue.id,
      name: queue.name,
      description: queue.description,
      order: queue.order,
      agentsCount: queue._count.queueAgents,
      ticketsCount: queue.queueAgents.reduce((sum, agent) => sum + agent.ticketCount, 0),
      createdAt: queue.createdAt,
    }));

    response(res, result, 200, {
      otherFields: { total, limit, offset },
      schema: z.array(queueSchemaResponse),
    });
  });
  static getQueueAgents = catchAsync(async (req, res, _next) => {
    const queueId = req.params.id as string;
    const agents = await QueueService.getQueueAgents({
      queueId,
      organizationId: req.organization.id,
    });
    response(res, agents, 200);
  });
  static updateQueue = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const input = req.body as UpdateQueueInput;
    const queue = await QueueService.update({
      queueId: id,
      organizationId: req.organization.id,
      input,
      userId: req.user.id,
    });
    response(res, queue, 200);
  });

  static deleteQueue = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    await QueueService.delete({
      queueId: id,
      organizationId: req.organization.id,
      userId: req.user.id,
    });
    response(res, null, 204);
  });
}
