import { CreateQueueGroupInput } from "@repo/schemas";
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
    response(res, queueGroup, 200);
  });
  static getAllQueueGroups = catchAsync(async (req, res, _next) => {
    const queueGroups = await QueueGroupService.getAllQueueGroups(req.organization.id);
    response(res, queueGroups, 200);
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
