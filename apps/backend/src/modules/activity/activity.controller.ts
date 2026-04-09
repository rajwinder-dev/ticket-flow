import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { ActivityService } from "./activity.service";

export class ActivityController {
  static getActivityLogs = catchAsync(async (req, res, _next) => {
    const logs = await ActivityService.getActivityLogs(req.organization.id);
    response(res, logs);
  });
  static getActivitySummary = catchAsync(async (req, res, _next) => {
    const data = await ActivityService.getActivitySummary(req.organization.id);
    response(res, data);
  });
}
