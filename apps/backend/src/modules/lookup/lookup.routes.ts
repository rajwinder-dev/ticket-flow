import { Router } from "express";
import { LookupController } from "./lookup.controller";
import { authMiddleware } from "../auth/auth.middleware";

const lookupRouter = Router()
lookupRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant)
lookupRouter.get("/groups", LookupController.getGroups)
lookupRouter.get("/queues/:groupId", LookupController.getQueues)
lookupRouter.get("/agents/:queueId", LookupController.getAgents)

export default lookupRouter
