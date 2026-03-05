import express from "express";
import { notifyController } from "./notification.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";

const notificationRouter = express.Router();
notificationRouter.use(authMiddleware.protectedRoute);
notificationRouter.route("/").get(notifyController.getNotification);

export default notificationRouter;
