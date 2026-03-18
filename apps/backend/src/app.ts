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
import { devMiddleware } from "./core/middleware/devMiddleware";
import { sanitizeMiddleware } from "./core/middleware/sanitizeMiddleware";
import { appError } from "./core/utils/appError";
import { globalHandler } from "./core/utils/globalHandler";

import authRouter from "./modules/auth/auth.route";
import organizationRouter from "./modules/organizations/organization.routes";
import userRouter from "./modules/user/user.routes";
import roleRouter from "./modules/role/role.route";

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

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// custom middleware
app.use(sanitizeMiddleware);

if (devMode) app.use(devMiddleware);

//  Routes
app.get("/", (_req, res) => {
  res.status(200).json({ status: "success" });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/org", organizationRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/role", roleRouter);

// app.use("/api/v1/employee", employeeRouter);
// app.use("/api/v1/roleAssign", roleAssignRouter);
// app.use("/api/v1/dashboard", dashboardRoute);
// app.use("/api/v1/team", teamRouter);
// app.use("/api/v1/notify", notificationRouter);
// app.use("/api/v1/chat", chatRouter);

app.all(/(.*)/, (req, res, next) => {

  return next(new appError(`Can't find ${req.originalUrl} on this server!`, 404, "INVALID_ROUTE"));
});

app.use(globalHandler);

export default app;
