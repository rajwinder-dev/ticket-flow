import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import path from "path";
import { devMode } from "./config/appConfig";
import { env } from "./config/env";

import { appError } from "./core/utils/appError";
import { globalHandler } from "./core/utils/globalHandler";

import { DevMiddleware } from "./core/middleware/devMiddleware";
import ActivityRouter from "./modules/activity/activity.routes";
import authRouter from "./modules/auth/auth.route";
import customerRoutes from "./modules/customer/customer.routes";
import dashboardRouter from "./modules/dashboard/dashboard.route";
import emailRouter from "./modules/email/email.routes";
import memberRouter from "./modules/member/member.routes";
import organizationRouter from "./modules/organizations/organization.routes";
import QueueRoutes from "./modules/queue/queue.routes";
import QueueGroupRoutes from "./modules/queueGroup/queueGroup.routes";
import roleRouter from "./modules/role/role.route";
import TicketRouter from "./modules/ticket/ticket.routes";
import tokenRoute from "./modules/token/token.routes";
import userRouter from "./modules/user/user.routes";
import webhookRouter from "./modules/webhook/webhook.routes";

export const app = express();

// dev logs
if (devMode) app.use(morgan("dev"));
// security
app.use(helmet());
app.use(hpp());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
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
// app.use("/webhooks",express.raw({ type: "application/json" }), webhookRouter)
app.use(express.json({ limit: "10kb" }));
app.use("/webhooks", webhookRouter);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// custom middleware
if (devMode) app.use(DevMiddleware.logRequests);

//  Routes
app.get("/", (_req, res) => {
  res.status(200).json({ status: "success" });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/auth", authRouter);
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
app.use("/api/v1/activity", ActivityRouter)
// app.use("/api/v1/notify", notificationRouter);
// app.use("/api/v1/chat", chatRouter);

app.all(/(.*)/, (req, res, next) => {
  return next(new appError(`Can't find ${req.originalUrl} on this server!`, 404, "INVALID_ROUTE"));
});

app.use(globalHandler);
export default app;
