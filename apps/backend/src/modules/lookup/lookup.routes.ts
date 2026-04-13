import { Router } from "express";
import { LookupController } from "./lookup.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { lookupInputGroupId } from "@repo/schemas";

const lookupRouter = Router()
lookupRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant)
lookupRouter.get("/groups", LookupController.getGroups)
lookupRouter.get("/queues/:groupId",validationMiddleware(lookupInputGroupId), LookupController.getQueues)
lookupRouter.get("/agents/:queueId", LookupController.getAgents)
lookupRouter.get("/roles", LookupController.getRoles)

export default lookupRouter
