import { authMiddleware } from "../auth/auth.middleware";

import { Router } from "express";
import { ActivityController } from "./activity.controller";

const ActivityRouter = Router();
ActivityRouter.use(
  authMiddleware.protectedRoute,
  authMiddleware.tenant,
  authMiddleware.restrictToOwner,
);
ActivityRouter.get("/", ActivityController.getActivityLogs);
ActivityRouter.get("/summary", ActivityController.getActivitySummary);
export default ActivityRouter;
