
import { createQueueGroupInput } from "@repo/schemas";
import { validUuidParams } from "@repo/schemas";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { QueueGroupController } from "./queueGroup.controller.js";
import { Router } from "express";

const QueueGroupRoutes = Router();

QueueGroupRoutes.use(authMiddleware.protectedRoute, authMiddleware.tenant);
// QueueGroups
QueueGroupRoutes.post(
  "/",
  validationMiddleware(createQueueGroupInput),
  QueueGroupController.createQueueGroup,
);
QueueGroupRoutes.delete(
  "/:id",
  validationMiddleware(validUuidParams),
  QueueGroupController.deleteQueueGroups,
);
QueueGroupRoutes.get("/", QueueGroupController.getAllQueueGroups);
QueueGroupRoutes.patch(
  "/:id",
  validationMiddleware(createQueueGroupInput),
  QueueGroupController.updateQueueGroup,
);
QueueGroupRoutes.patch(
  "/:id/default",
  validationMiddleware(validUuidParams),
  QueueGroupController.setDefaultGroup,
);

export default QueueGroupRoutes;
