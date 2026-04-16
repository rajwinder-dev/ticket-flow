import {
  assignTicketInput,
  createTicketCommentInput,
  createTicketInput,
  escalateTicketInput,
  updateTicketInput,
  updateTicketPriorityInput,
  updateTicketStatusInput,
} from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { TicketController } from "./ticket.controller.js";

const TicketRouter: Router = Router();
TicketRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
TicketRouter.post(
  "/",
  authMiddleware.verifyPermission("ticket", "create"),
  validationMiddleware(createTicketInput),
  TicketController.createTicket,
);
TicketRouter.patch(
  "/:ticketId",
  authMiddleware.verifyPermission("ticket", "edit"),
  validationMiddleware(updateTicketInput),
  TicketController.updateTicket,
);
TicketRouter.get(
  "/",
  authMiddleware.verifyPermission("ticket", "view_all"),
  TicketController.getAllTickets,
);
TicketRouter.get(
  "/summary",
  authMiddleware.verifyPermission("ticket", "summary"),
  TicketController.getSummary,
);
TicketRouter.get(
  "/me",
  authMiddleware.verifyPermission("ticket", "view_own"),
  TicketController.getAssignedTickets,
);
TicketRouter.get("/:id",authMiddleware.verifyPermission("ticket", "details"), TicketController.getTicketDetails);
TicketRouter.patch(
  "/:id/status",
  authMiddleware.verifyPermission("ticket", "change_status"),
  validationMiddleware(updateTicketStatusInput),
  TicketController.updateStatus,
);
TicketRouter.patch(
  "/:id/priority",
  authMiddleware.verifyPermission("ticket", "change_priority"),
  validationMiddleware(updateTicketPriorityInput),
  TicketController.updatePriority,
);
TicketRouter.patch(
  "/:id/assign",
  authMiddleware.verifyPermission("ticket", "assign"),
  validationMiddleware(assignTicketInput),
  TicketController.assignTicket,
);
TicketRouter.post(
  "/:id/comment",
  authMiddleware.verifyPermission("comment", "create"),
  validationMiddleware(createTicketCommentInput),
  TicketController.addComment,
);
TicketRouter.get(
  "/:id/comment",
  authMiddleware.verifyPermission("comment", "create"),
  TicketController.getTicketComments,
);
TicketRouter.post(
  "/:id/escalate",
  authMiddleware.verifyPermission("ticket", "escalate"),

  validationMiddleware(escalateTicketInput),
  TicketController.escalate,
);
TicketRouter.get(
  "/:id/escalate-options",
  authMiddleware.verifyPermission("ticket", "escalate"),
  TicketController.getEscalateOptions,
);
export default TicketRouter;
TicketRouter.get(
  "/:id/transition-history",
  authMiddleware.verifyPermission("ticket", "transition_history"),
  TicketController.getTransitionHistory,
);
