import { lookupInputGroupId } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { LookupController } from "./lookup.controller.js";

const lookupRouter: Router = Router();
lookupRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
lookupRouter.get("/groups", LookupController.getGroups);
lookupRouter.get(
  "/queues/:groupId",
  validationMiddleware(lookupInputGroupId),
  LookupController.getQueues,
);
lookupRouter.get("/agents/:queueId", LookupController.getAgents);
lookupRouter.get("/roles", LookupController.getRoles);

export default lookupRouter;
