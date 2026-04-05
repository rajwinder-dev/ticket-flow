import {
  AddAgentsToQueueInput,
  CreateQueueInput,
  RemoveAgentsFromQueueInput,
  UpdateQueueInput,
} from "@repo/schemas";
import { APIFeatures } from "../../core/utils/apiFeatures";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { QueueService } from "./queue.service";

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
      orderBy: {
        order: "asc",
      },
      skip: offset,
      take: limit,
    });
    response(res, queues, 200);
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
