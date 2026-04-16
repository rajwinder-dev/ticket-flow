import { changeMemberQueueInput, changeMemberRoleInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { MemberController } from "./member.controller.js";

const memberRouter: Router = Router();
memberRouter.use(authMiddleware.protectedRoute);
memberRouter.use(authMiddleware.tenant);

memberRouter.get(
  "/",
  authMiddleware.verifyPermission("member", "view_all"),
  MemberController.getMembers,
);
memberRouter.post(
  "/:queueId/agents/:userId",
  authMiddleware.verifyPermission("member", "assign_queue"),
  validationMiddleware(changeMemberQueueInput),
  MemberController.assignQueue,
);
memberRouter.post(
  "/:roleId/roles/:userId",
  authMiddleware.verifyPermission("member", "change_role"),
  validationMiddleware(changeMemberRoleInput),
  MemberController.updateRole,
);
memberRouter.delete(
  "/:queueId/agents/:userId/unassign",
  authMiddleware.verifyPermission("member", "unassign_queue"),
  validationMiddleware(changeMemberQueueInput),
  MemberController.unassignQueue,
);

export default memberRouter;
