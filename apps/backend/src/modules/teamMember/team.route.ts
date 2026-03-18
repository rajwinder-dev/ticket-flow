import express from "express";

import { authMiddleware } from "../auth/auth.middleware";

const TeamController = express.Router();
TeamController.use(authMiddleware.protectedRoute);



export default TeamController;
