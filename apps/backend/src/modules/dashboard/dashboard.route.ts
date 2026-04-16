import express, { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { dashboardController } from "./dashboard.controller.js";
const dashboardRouter : Router = express.Router();
dashboardRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
dashboardRouter.get("/summary", dashboardController.getSummary);
dashboardRouter.get("/recent-tickets", dashboardController.getRecentTickets)
export default dashboardRouter;
