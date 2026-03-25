import http from "http";
import { AddressInfo } from "net";
import { app } from "./app";
import { devMode } from "./config/appConfig";
import { env } from "./config/env";
import { log } from "./core/helper/log";
import { connectUntilSuccess } from "./core/utils/dbConnect";
import { prisma } from "./core/utils/prismaClient";
import { socket } from "./core/utils/websocket";

const port = Number(env.port);
export const server = http.createServer(app);
const wss = env.wss && socket(server);

if (env.nodeEnv !== "test")
  server.listen(port, async () => {
    await connectUntilSuccess();
    const actualPort = (server.address() as AddressInfo).port;
    log.success(`Server running at http://localhost:${actualPort}`);
    if (wss) log.success("Websocket is running");

    if (devMode) log.info("🪛  Development Mode");
  });

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const shutdown = async (signal: string) => {
  console.log(`\n👋 ${signal} RECEIVED. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
  });
  if (wss) {
    wss.close(() => {
      console.log("WebSocket server closed.");
    });
  }
  try {
    await prisma.$disconnect();
    console.log("DB disconnected.");
  } catch (err) {
    console.error("Error during DB disconnect:", err);
  }

  console.log("Process terminated. 🛑");
  process.exit(0);
};

// Listen for BOTH restart and termination signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
