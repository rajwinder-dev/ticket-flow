import {
  AddAgentsToQueueInput,
  CreateQueueInput,
  queueMembersSchemaResponse,
  queueSchemaResponse,
  RemoveAgentsFromQueueInput,
  UpdateQueueInput,
} from '@org/zod';
import z from 'zod';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { QueueService } from './queue.service.js';

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
    const data = await QueueService.getDetails({
      queueId,
      organizationId: req.organization.id,
    });
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
    response(res, null, 200);
  });
  static getQueues = catchAsync(async (req, res, _next) => {
    const groupId = req.params.id as string;
    const { data, pagination } = await QueueService.getQueues({
      groupId,
      organizationId: req.organization.id,
      queryString: req.query,
    });

    response(res, data, 200, {
      otherFields: pagination,
      schema: z.array(queueSchemaResponse),
    });
  });

  static getQueueAgents = catchAsync(async (req, res, _next) => {
    const queueId = req.params.id as string;
    const agents = await QueueService.getQueueAgents({
      queueId,
      organizationId: req.organization.id,
    });
    response(res, agents, 200, { schema: z.array(queueMembersSchemaResponse) });
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
