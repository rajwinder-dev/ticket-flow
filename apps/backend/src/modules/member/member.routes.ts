import { changeMemberQueueInput, changeMemberRoleInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { MemberController } from "./member.controller";

const memberRouter = Router();
memberRouter.use(authMiddleware.protectedRoute);
memberRouter.use(authMiddleware.tenant, authMiddleware.restrictToOwner);

memberRouter.get("/", MemberController.getMembers);
memberRouter.post(
  "/:queueId/agents/:userId",
  validationMiddleware(changeMemberQueueInput),
  MemberController.assignQueue,
);
memberRouter.post(
  "/:roleId/roles/:userId",
  validationMiddleware(changeMemberRoleInput),
  MemberController.updateRole,
);
memberRouter.delete(
  "/:queueId/agents/:userId/unassign",
  validationMiddleware(changeMemberQueueInput),
  MemberController.unassignQueue,
);
export default memberRouter;
