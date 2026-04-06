import { CreateQueueGroupInput, queueGroupSchemaResponse } from "@repo/schemas";
import z from "zod";
import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { QueueGroupService } from "../queueGroup/queueGroup.service";
export class QueueGroupController {
  static createQueueGroup = catchAsync(async (req, res, _next) => {
    const input = req.body as CreateQueueGroupInput;
    const queueGroup = await QueueGroupService.createQueueGroup({
      userId: req.user.id,
      organizationId: req.organization.id,
      input,
    });
    if (input.isDefault) {
      await QueueGroupService.setDefaultGroup({
        groupId: queueGroup.id,
        organizationId: req.organization.id,
        userId: req.user.id,
      });
    }
    response(res, queueGroup, 201);
  });
  static updateQueueGroup = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const input = req.body as CreateQueueGroupInput;
    const queueGroup = await QueueGroupService.updateQueueGroup({
      groupId: id,
      organizationId: req.organization.id,
      userId: req.user.id,
      input,
    });
    if (input.isDefault) {
      await QueueGroupService.setDefaultGroup({
        groupId: queueGroup.id,
        organizationId: req.organization.id,
        userId: req.user.id,
      });
    }
    response(res, queueGroup, 200);
  });
  static getAllQueueGroups = catchAsync(async (req, res, _next) => {
    const { data, pagination } = await QueueGroupService.getAllQueueGroups(
      req.organization.id,
      req.query,
    );
    response(res, data, 200, {
      schema: z.array(queueGroupSchemaResponse),
      otherFields: { ...pagination },
    });
  });
  static setDefaultGroup = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    await QueueGroupService.setDefaultGroup({
      groupId: id,
      organizationId: req.organization.id,
      userId: req.user.id,
    });
    response(res, null, 204);
  });
  static deleteQueueGroups = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    await QueueGroupService.deleteQueueGroup({
      groupId: id,
      organizationId: req.organization.id,
      userId: req.user.id,
    });
    response(res, null, 204);
  });
}
