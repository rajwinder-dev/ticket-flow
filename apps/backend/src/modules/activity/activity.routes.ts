import { authMiddleware } from "../auth/auth.middleware.js";

import { Router } from "express";
import { ActivityController } from "./activity.controller.js";

const ActivityRouter = Router();
ActivityRouter.use(
  authMiddleware.protectedRoute,
  authMiddleware.tenant,
  authMiddleware.restrictToOwner,
);
ActivityRouter.get(
  "/",
  authMiddleware.verifyPermission("activity", "view"),
  ActivityController.getActivityLogs,
);
ActivityRouter.get(
  "/summary",
  authMiddleware.verifyPermission("activity", "view"),
  ActivityController.getActivitySummary,
);
export default ActivityRouter;
