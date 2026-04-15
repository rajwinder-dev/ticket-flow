import { Router } from "express";

const QueueRoutes = Router();

import {
  addAgentsToQueueInput,
  createQueueInput,
  removeAgentsFromQueueInput,
  updateQueueInput,
  validUuidParams,
} from "@repo/schemas";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { QueueController } from "./queue.controller.js";

QueueRoutes.use(authMiddleware.protectedRoute, authMiddleware.tenant);

// queues agents
QueueRoutes.post(
  "/:id/agents",
  validationMiddleware(addAgentsToQueueInput),
  QueueController.addAgents,
);
QueueRoutes.patch(
  "/:id/agents",
  validationMiddleware(removeAgentsFromQueueInput),
  QueueController.removeAgents,
);
// queues routes
QueueRoutes.post(
  "/:id",
  authMiddleware.verifyPermission("queue", "create"),
  validationMiddleware(createQueueInput),
  QueueController.createQueue,
);
QueueRoutes.get(
  "/:id",
  authMiddleware.verifyPermission("queue", "view_all"),
  QueueController.getQueues,
);
QueueRoutes.get(
  "/:id/details",
  authMiddleware.verifyPermission("queue", "view_details"),
  validationMiddleware(validUuidParams),
  QueueController.getQueueDetails,
);
QueueRoutes.get(
  "/:id/summary",
  authMiddleware.verifyPermission("queue", "view_details"),
  validationMiddleware(validUuidParams),
  QueueController.getQueueSummary,
);
QueueRoutes.patch(
  "/:id",
  authMiddleware.verifyPermission("queue", "edit"),
  validationMiddleware(updateQueueInput),
  QueueController.updateQueue,
);
QueueRoutes.get(
  "/:id/agents",
  authMiddleware.verifyPermission("queue", "view_details"),
  validationMiddleware(validUuidParams),
  QueueController.getQueueAgents,
);
QueueRoutes.delete(
  "/:id",
  authMiddleware.verifyPermission("queue", "delete"),
  validationMiddleware(validUuidParams),
  QueueController.deleteQueue,
);
export default QueueRoutes;
