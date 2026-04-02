import { Router } from "express";
import { TokenController } from "./token.controller";

const tokenRoute = Router();
tokenRoute.get("/:token/details", TokenController.getTokenDetails);
export default tokenRoute;
