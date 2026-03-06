import express from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { dashboardController } from "./dashboard.controller";
const dashboardRouter = express.Router();
dashboardRouter.use(authMiddleware.protectedRoute);
dashboardRouter
  .route("/admin")
  .get(authMiddleware.restrictRote("admin"), dashboardController.getAdminSummary);
dashboardRouter
  .route("/manager")
  .get(authMiddleware.restrictRote("manager"), dashboardController.getManagerSummary);
dashboardRouter
  .route("/employee")
  .get(authMiddleware.restrictRote("employee"), dashboardController.getEmployeeSummary);
export default dashboardRouter;
