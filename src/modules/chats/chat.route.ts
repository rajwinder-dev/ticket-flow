import { authMiddleware } from "../../core/middleware/auth.middleware";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { chatController } from "./chat.controller";
import { groupChat } from "./chat.zod";
import express from "express";
const chatRouter = express.Router();
chatRouter.use(authMiddleware.protectedRoute);

chatRouter.route("/rooms").get(chatController.getAllChatRooms);
chatRouter.route("/markRead").patch(chatController.markRead);
chatRouter.route("/markDelivered").patch(chatController.markDelivered);
chatRouter
  .route("/create")
  .post(validationMiddleware(groupChat), chatController.createGroup);
chatRouter.route("/:id").get(chatController.getMessages);
export default chatRouter;
