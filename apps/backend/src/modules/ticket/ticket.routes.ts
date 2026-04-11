import {
  assignTicketInput,
  createTicketCommentInput,
  createTicketInput,
  updateTicketInput,
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
  "/me",
  authMiddleware.verifyPermission("ticket", "view_own"),
  TicketController.getAssignedTickets,
);
TicketRouter.get("/:id", TicketController.getTicketDetails);
TicketRouter.patch(
  "/:id/status",
  authMiddleware.verifyPermission("ticket", "change_status"),
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
  authMiddleware.verifyPermission("ticket", "assign"),
  validationMiddleware(assignTicketInput),
  TicketController.assignTicket,
);
TicketRouter.post(
  "/:id/comment",
  authMiddleware.verifyPermission("ticket", "add_comment"),
  validationMiddleware(createTicketCommentInput),
  TicketController.addComment,
);
TicketRouter.post(
  "/:id/escalate",
  validationMiddleware(validUuidParams),
  TicketController.escalate,
);
export default TicketRouter;
