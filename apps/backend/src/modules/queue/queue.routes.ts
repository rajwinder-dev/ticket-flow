import { Router } from "express";

const QueueRoutes = Router();

import {
  addAgentsToQueueInput,
  createQueueInput,
  removeAgentsFromQueueInput,
  updateQueueInput,
} from "@repo/schemas";
import { validUuidParams } from "@repo/schemas";
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
QueueRoutes.post("/:id", validationMiddleware(createQueueInput), QueueController.createQueue);
QueueRoutes.get("/:id", QueueController.getQueues);
QueueRoutes.get(
  "/:id/details",
  validationMiddleware(validUuidParams),
  QueueController.getQueueDetails,
);
QueueRoutes.get(
  "/:id/summary",
  validationMiddleware(validUuidParams),
  QueueController.getQueueSummary,
);
QueueRoutes.patch("/:id", validationMiddleware(updateQueueInput), QueueController.updateQueue);
QueueRoutes.get(
  "/:id/agents",
  validationMiddleware(validUuidParams),
  QueueController.getQueueAgents,
);
QueueRoutes.delete("/:id", validationMiddleware(validUuidParams), QueueController.deleteQueue);
export default QueueRoutes;
