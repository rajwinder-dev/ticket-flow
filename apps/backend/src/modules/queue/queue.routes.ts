import { Router } from "express";

const QueueRoutes = Router();

import {
  addAgentsToQueueInput,
  createQueueInput,
  removeAgentsFromQueueInput,
  updateQueueInput,
} from "@repo/schemas";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { QueueController } from "./queue.controller";
QueueRoutes.use(authMiddleware.protectedRoute, authMiddleware.tenant);

QueueRoutes.post("/", validationMiddleware(createQueueInput), QueueController.createQueue);
QueueRoutes.get("/", QueueController.getQueues);
QueueRoutes.patch("/:id", validationMiddleware(updateQueueInput), QueueController.updateQueue);
QueueRoutes.delete("/:id", QueueController.deleteQueue);
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
export default QueueRoutes;
