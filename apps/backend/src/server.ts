import http from "http";
import { app } from "./app";
import { devMode } from "./config/appConfig";
import { socket } from "./core/utils/websocket";
import { AddressInfo } from "net";
import { connectUntilSuccess } from "./core/utils/dbConnect";

const port = Number(process.env.PORT) || 4000;
export const server = http.createServer(app);
export const wss = socket(server);
connectUntilSuccess();

if (process.env.NODE_ENV !== "test")
  server.listen(port, () => {
    const actualPort = (server.address() as AddressInfo).port;
    console.log(
      `🚀 Server running at http://localhost:${actualPort} ${
        process.env.WSS
          ? `with WebSocket on same port`
          : `(WebSocket not enabled)`
      } ${devMode ? "in development mode" : ""}`
    );
  });
// Listens for unhandled promise rejections—basically, when a Promise throws an error that isn’t caught with .catch() or try/catch.
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
// Listens for the SIGTERM signal, which is a system-level signal sent to terminate a process.
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
