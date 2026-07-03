import { catchAsync } from "../../core/utils/catchAsync.js";
import response from "../../core/utils/response.js";
import { ActivityService } from "./activity.service.js";

export class ActivityController {
  static getActivityLogs = catchAsync(async (req, res, _next) => {
    const { data, pagination } = await ActivityService.getActivityLogs(
      req.organization.id,
      req.query,
    );
    response(res, data, 200, { otherFields: pagination });
  });
  static getActivitySummary = catchAsync(async (req, res, _next) => {
    const data = await ActivityService.getActivitySummary(req.organization.id);
    response(res, data);
  });
}
