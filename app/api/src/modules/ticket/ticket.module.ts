import { Router } from "express";
import TicketRouter from "./ticket/ticket.routes";
import TicketCommentsRouter from "./comments/comments.router";
import TicketTransitionRouter from "./transition/ticketTransition.router";

const TicketModuleRouter: Router = Router();

TicketModuleRouter.use('/', TicketRouter);
TicketModuleRouter.use('/', TicketCommentsRouter);
TicketModuleRouter.use('/', TicketTransitionRouter);

export default TicketModuleRouter;

