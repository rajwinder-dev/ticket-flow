import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import path from "path";
import { devMode } from "./config/appConfig.js";
import { env } from "./config/env.js";

import { appError } from "./core/utils/appError.js";
import { globalHandler } from "./core/utils/globalHandler.js";

import { toNodeHandler } from "better-auth/node";
import { DevMiddleware } from "./core/middleware/devMiddleware.js";
import ActivityRouter from "./modules/activity/activity.routes.js";
import customerRoutes from "./modules/customer/customer.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.route.js";
import emailRouter from "./modules/email/email.routes.js";
import memberRouter from "./modules/member/member.routes.js";
import organizationRouter from "./modules/organizations/organization.routes.js";
import QueueRoutes from "./modules/queue/queue.routes.js";
import roleRouter from "./modules/role/role.route.js";
import TicketRouter from "./modules/ticket/ticket.routes.js";
import tokenRoute from "./modules/token/token.routes.js";
import userRouter from "./modules/user/user.routes.js";
import webhookRouter from "./modules/webhook/webhook.routes.js";
import lookupRouter from "./modules/lookup/lookup.routes.js";
import { auth } from "./lib/auth.js";
import QueueGroupRoutes from "./modules/queueGroup/queueGroup.routes.js";

export const app: Express = express();

// dev logs
if (devMode) app.use(morgan("dev"));
// security
app.set("trust proxy", 1);
app.use(helmet());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  message: "Too many requests from this IP , please try again in an hour!",
});
if (!devMode) app.use(limiter);

app.use(
  cors({
    origin: env.coreURL,
    credentials: true,
  }),
);
app.set("view engine", "ejs");
app.use("/webhooks", express.raw({ type: "application/json" }), webhookRouter);
app.use("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// custom middleware
if (devMode) app.use(DevMiddleware.logRequests);

//  Routes
app.get("/", (_req, res) => {
  res.status(200).json({ status: "success" });
});
const __dirname = import.meta.dirname;
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/token", tokenRoute);
app.use("/api/v1/org", organizationRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/email", emailRouter);
app.use("/api/v1/queue", QueueRoutes);
app.use("/api/v1/queue-group", QueueGroupRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/ticket", TicketRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/member", memberRouter);
app.use("/api/v1/activity", ActivityRouter);
app.use("/api/v1/lookup", lookupRouter);

app.all(/(.*)/, (req, _res, next) => {
  return next(new appError(`Can't find ${req.originalUrl} on this server!`, 404, "INVALID_ROUTE"));
});

app.use(globalHandler);
export default app;
