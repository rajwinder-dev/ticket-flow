import express from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { dashboardController } from "./dashboard.controller";
const dashboardRouter = express.Router();
dashboardRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
dashboardRouter.get("/summary", dashboardController.getSummary);
export default dashboardRouter;
