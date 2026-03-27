import {
  assignTicketInput,
  createTicketCommentInput,
  createTicketInput,
  updateTicketPriorityInput,
  updateTicketStatusInput,
} from "@repo/schemas";
import { validUuidParams } from "@repo/schemas/src/global.zod";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { TicketController } from "./ticket.controller";

const TicketRouter = Router();
TicketRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
TicketRouter.post(
  "/",
  authMiddleware.verifyPermissions("ticket", "create"),
  validationMiddleware(createTicketInput),
  TicketController.createTicket,
);
TicketRouter.get(
  "/",
  authMiddleware.verifyPermissions("ticket", "view_all"),
  TicketController.getAllTickets,
);
TicketRouter.get(
  "/me",
  authMiddleware.verifyPermissions("ticket", "view_own"),
  TicketController.getAssignedTickets,
);
TicketRouter.patch(
  "/:id/status",
  authMiddleware.verifyPermissions("ticket", "change_status"),
  validationMiddleware(updateTicketStatusInput),
  TicketController.updateStatus,
);
TicketRouter.patch(
  "/:id/priority",
  validationMiddleware(updateTicketPriorityInput),
  TicketController.updatePriority,
);
TicketRouter.patch(
  "/:id/assign",
  authMiddleware.verifyPermissions("ticket", "assign"),
  validationMiddleware(assignTicketInput),
  TicketController.assignTicket,
);
TicketRouter.post(
  "/:id/comment",
  authMiddleware.verifyPermissions("ticket", "add_comment"),
  validationMiddleware(createTicketCommentInput),
  TicketController.addComment,
);
TicketRouter.post(
  "/:id/escalate",
  authMiddleware.verifyPermissions("ticket", "view_own"),
  validationMiddleware(validUuidParams),
  TicketController.escalate,
);
export default TicketRouter;
