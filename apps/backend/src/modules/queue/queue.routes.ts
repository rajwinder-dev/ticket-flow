import { Router } from "express";

const QueueRoutes = Router();

import {
  addAgentsToQueueInput,
  createQueueGroupInput,
  createQueueInput,
  removeAgentsFromQueueInput,
  updateQueueInput,
} from "@repo/schemas";
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
QueueRoutes.delete("/group/:id", QueueController.deleteQueueGroups);
QueueRoutes.get("/group", QueueController.getAllQueueGroups);
QueueRoutes.patch(
  "/group/:id",
  validationMiddleware(createQueueGroupInput),
  QueueController.updateQueueGroup,
);
QueueRoutes.patch("/group/:id/default", QueueController.setDefaultGroup);
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
QueueRoutes.post("/:groupId", validationMiddleware(createQueueInput), QueueController.createQueue);
QueueRoutes.get("/", QueueController.getQueues);
QueueRoutes.patch("/:id", validationMiddleware(updateQueueInput), QueueController.updateQueue);
QueueRoutes.delete("/:id", QueueController.deleteQueue);
export default QueueRoutes;
