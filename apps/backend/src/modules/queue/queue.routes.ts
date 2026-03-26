import { Router } from "express";

const QueueRoutes = Router();

import {
  addAgentsToQueueInput,
  createQueueGroupInput,
  createQueueInput,
  removeAgentsFromQueueInput,
  updateQueueInput,
} from "@repo/schemas";
import { validUuid } from "@repo/schemas/src/global.zod";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { QueueController } from "./queue.controller";

QueueRoutes.use(authMiddleware.protectedRoute, authMiddleware.tenant);
// QueueGroups
QueueRoutes.post(
  "/group",
  validationMiddleware(createQueueGroupInput),
  QueueController.createQueueGroup,
);
QueueRoutes.delete(
  "/group/:id",
  validationMiddleware(validUuid),
  QueueController.deleteQueueGroups,
);
QueueRoutes.get("/group", QueueController.getAllQueueGroups);
QueueRoutes.patch(
  "/group/:id",
  validationMiddleware(createQueueGroupInput),
  QueueController.updateQueueGroup,
);
QueueRoutes.patch(
  "/group/:id/default",
  validationMiddleware(validUuid),
  QueueController.setDefaultGroup,
);
// queues agents
QueueRoutes.post(
  "/:id/agents",
  validationMiddleware(addAgentsToQueueInput),
  QueueController.addAgents,
);
QueueRoutes.delete(
  "/:id/agents",
  validationMiddleware(removeAgentsFromQueueInput),
  QueueController.removeAgents,
);
// queues routes
QueueRoutes.post("/:id", validationMiddleware(createQueueInput), QueueController.createQueue);
QueueRoutes.get("/:id/group", QueueController.getQueues);
QueueRoutes.patch("/:id", validationMiddleware(updateQueueInput), QueueController.updateQueue);
QueueRoutes.get("/:id/agents", validationMiddleware(validUuid), QueueController.getQueueAgents);
QueueRoutes.delete("/:id", validationMiddleware(validUuid), QueueController.deleteQueue);
export default QueueRoutes;
