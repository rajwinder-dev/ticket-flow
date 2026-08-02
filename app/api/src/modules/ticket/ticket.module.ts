import { Router } from "express";
import TicketRouter from "./ticket/ticket.routes";
import TicketCommentsRouter from "./comments/comments.router";
import TicketTransitionRouter from "./transition/ticketTransition.router";
import ticketAiRouter from "./ai/ticketAi.routes";

const ticketModuleRouter: Router = Router();

ticketModuleRouter.use('/', TicketRouter);
ticketModuleRouter.use('/', TicketCommentsRouter);
ticketModuleRouter.use('/', TicketTransitionRouter);
ticketModuleRouter.use("/", ticketAiRouter)
export default ticketModuleRouter;

