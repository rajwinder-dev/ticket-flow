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
TicketRouter.post("/", validationMiddleware(createTicketInput), TicketController.createTicket);
TicketRouter.get("/", TicketController.getAllTickets);
TicketRouter.get("/me", TicketController.getAssignedTickets);
TicketRouter.patch(
  "/:id/status",
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
  validationMiddleware(assignTicketInput),
  TicketController.assignTicket,
);
TicketRouter.post(
  "/:id/comment",
  validationMiddleware(createTicketCommentInput),
  TicketController.addComment,
);
TicketRouter.post(
  "/:id/escalate",
  validationMiddleware(validUuidParams),
  TicketController.escalate,
);
export default TicketRouter;
