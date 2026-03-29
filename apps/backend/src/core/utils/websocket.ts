import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { chatServer } from "../../modules/x chats /chat.service";
import { messageSchema, messageStatus } from "../../modules/x chats /chat.zod";
import { chatStatusServer } from "../../modules/x chats /chatStatus.service";
import { decodeToken } from "../helper/websocketHelper";
export const clients = new Map<string, WebSocket>();

export function socket(server: Server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws: WebSocket, req) => {
    const openChats = new Set<string>();
    const url = new URL(req.url || "/", "http://localhost");
    const token = url.searchParams.get("token");

    if (!token) {
      ws.send("Token missing");
      return ws.close(4001, "Token missing");
    }
    let userData;
    try {
      userData = decodeToken(token);
      chatStatusServer.broadCastStatus(userData.id, "online");
      ws.send("Connected!");
      console.log(`User ${userData.id} connected`);
    } catch (err) {
      console.log(err);
      ws.send("Invalid token");
      return ws.close(4001, "Invalid token");
    }

    ws.on("message", (message) => {
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch {
        return ws.send("Invalid JSON format");
      }

      data.senderId = userData.id;

      switch (data.type) {
        case "message": {
          const result = messageSchema.safeParse(data);
          if (!result.success) return ws.send("Invalid chat:message payload");
          const chat = new chatServer(result.data);
          chat.handleMessage();
          if (result.data.chatId) openChats.add(result.data.chatId);
          break;
        }

        case "chat:open": {
          const result = messageStatus.safeParse(data);
          if (!result.success) return ws.send("Invalid chat:open payload");
          chatStatusServer.handleChatStatus(userData.id, result.data.chatId);
          break;
        }

        default:
          ws.send("Please provide a valid input type");
      }
    });

    ws.on("close", async (code) => {
      if (clients.get(userData.id) === ws) {
        clients.delete(userData.id);
        console.log(`User ${userData.id} disconnected. Code: ${code}`);

        await chatStatusServer.broadCastStatus(userData.id, "offline");

        for (const chat of openChats) {
          chatStatusServer.handleChatStatus(userData.id, chat);
        }
      }
    });
  });
  return wss;
}
