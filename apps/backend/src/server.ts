import http from "http";
import { AddressInfo } from "net";
import { app } from "./app.js";
import { devMode } from "./config/appConfig.js";
import { env } from "./config/env.js";
import { log } from "@repo/utils";
import { connectUntilSuccess } from "./core/utils/dbConnect.js";
import { prisma } from "@repo/database";

const port = Number(env.port);
export const server = http.createServer(app);

if (env.nodeEnv !== "test")
  server.listen(port, '0.0.0.0', async () => {
    await connectUntilSuccess();
    const actualPort = (server.address() as AddressInfo).port;
      log.success(`Server running on port ${actualPort}`);


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
process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"));
