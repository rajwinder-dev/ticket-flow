import dotenv from "dotenv";
import http from "http";
import { AddressInfo } from "net";
import { app } from "./app";
import { devMode } from "./config/appConfig";
import { env } from "./config/env";
import { log } from "./core/helper/extraHelper";
import { connectUntilSuccess } from "./core/utils/dbConnect";
import { socket } from "./core/utils/websocket";
dotenv.config({ path: "./.env" });

const port = Number(env.port);
export const server = http.createServer(app);
export const wss = socket(server);

if (env.nodeEnv !== "test")
  server.listen(port, async () => {
    await connectUntilSuccess();
    const actualPort = (server.address() as AddressInfo).port;
    log.success(`Server running at http://localhost:${actualPort}`);
    if (env.wss) log.success("Websocket is running");
    else log.info("Websocket is disabled");
    if (devMode) log.info("🪛  Development Mode");
  });

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
