import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { ActivityService } from "./activity.service";

export class ActivityController {
  static getActivityLogs = catchAsync(async (req, res) => {
    const logs = await ActivityService.getActivityLogs(req.organization.id);
    response(res, logs);
  });
}
