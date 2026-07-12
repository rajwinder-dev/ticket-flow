import { authMiddleware } from "../auth/auth.middleware.js";

import { Router } from "express";
import { ActivityController } from "./activity.controller.js";

const ActivityRouter: Router = Router();
ActivityRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
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
