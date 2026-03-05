import { prisma } from "../../core/utils/prismaClient";
import { clients } from "../../core/utils/websocket";

export class chatStatusServer {
  static async handleChatStatus(senderId: string, chatId: string) {
    const groupMembers = await prisma.participant.findMany({
      where: {
        chatId,
      },
    });
    const ids = groupMembers.map((item) => item.userId);

    const onlineUsers: string[] = [];

    ids.forEach((id) => {
      const client = clients.get(id);
      if (client) {
        onlineUsers.push(id); // Add user ID to the online list
      }
    });
    const senderClient = clients.get(senderId);
    if (senderClient) {
      senderClient.send(
        JSON.stringify({
          type: "chat:onlineUsers",
          chatId,
          onlineUsers,
        })
      );
    }
  }
  static async broadCastStatus(senderId: string, status: string = "online") {
    for (const [id, ws] of clients.entries()) {
      if (id !== senderId) {
        ws.send(
          JSON.stringify({
            type: "user:status",
            userId: senderId,
            status,
          })
        );
      }
    }
  }
  static async broadCastMessageStatus(
    senderIds: string[],
    messageIds: string[],
    status: string
  ) {
    senderIds.map((id) => {
      const client = clients.get(id);
      if (client) {
        client.send(
          JSON.stringify({
            type: "message:status",
            messageIds,
            status,
          })
        );
      }
    });
  }
}
