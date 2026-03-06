import express from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { notifyController } from "./notification.controller";

const notificationRouter = express.Router();
notificationRouter.use(authMiddleware.protectedRoute);
notificationRouter.route("/").get(notifyController.getNotification);

export default notificationRouter;
