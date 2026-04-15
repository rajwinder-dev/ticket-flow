import { createQueueGroupInput, validUuidParams } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { QueueGroupController } from "./queueGroup.controller.js";

const QueueGroupRoutes = Router();

QueueGroupRoutes.use(authMiddleware.protectedRoute, authMiddleware.tenant);
// QueueGroups
QueueGroupRoutes.post(
  "/",
  authMiddleware.verifyPermission("group", "create"),
  validationMiddleware(createQueueGroupInput),
  QueueGroupController.createQueueGroup,
);
QueueGroupRoutes.delete(
  "/:id",
  authMiddleware.verifyPermission("group", "delete"),
  validationMiddleware(validUuidParams),
  QueueGroupController.deleteQueueGroups,
);
QueueGroupRoutes.get(
  "/",
  authMiddleware.verifyPermission("group", "view_all"),
  QueueGroupController.getAllQueueGroups,
);
QueueGroupRoutes.patch(
  "/:id",
  authMiddleware.verifyPermission("group", "edit"),
  validationMiddleware(createQueueGroupInput),
  QueueGroupController.updateQueueGroup,
);
QueueGroupRoutes.patch(
  "/:id/default",
    authMiddleware.verifyPermission("group", "set_default"),
  validationMiddleware(validUuidParams),
  QueueGroupController.setDefaultGroup,
);

export default QueueGroupRoutes;
