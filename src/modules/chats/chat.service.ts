import { encrypt } from "../../core/utils/crypto";
import { chatStatusServer } from "./chatStatus.service";
import { prisma } from "../../core/utils/prismaClient";
import { clients } from "../../core/utils/websocket";

export class chatServer {
  message: string;
  senderId: string;
  receiveId?: string;
  chatId: string;
  providedChatId?: string;
  constructor(data: {
    message: string;
    senderId: string;
    receiveId?: string;
    chatId?: string;
  }) {
    this.message = data.message;
    this.senderId = data.senderId;
    this.receiveId = data.receiveId;
    this.providedChatId = data.chatId;
    this.chatId = this.generateChatId();
  }
  async handleMessage() {
    if (this.providedChatId) {
      await this.handleGroupMessage();
    } else if (this.receiveId) {
      await this.handleOneToOneMessage();
    }
  }

  private async handleGroupMessage() {
    // verify authorization
    const data = await prisma.participant.findMany({
      where: {
        chatId: this.providedChatId,
      },
      select: {
        userId: true,
      },
    });
    const userIds = data.map((item) => item.userId);

    if (!userIds.includes(this.senderId)) console.log("provide valid chatID ");
    const { content, iv, tag } = encrypt(this.message);

    // create chat on database
    if (userIds.includes(this.senderId) && this.providedChatId) {
      await prisma.messaging.create({
        data: {
          senderId: this.senderId,
          message: content,
          chatId: this.providedChatId,
          iv: iv,
          tag: tag,
        },
      });

      // broadcast this message to all users or notify everyone except owner
      userIds.map((id) => {
        if (id && id !== this.senderId) console.log("send message to " + id);
        clients.get(id)?.send(
          JSON.stringify({
            message: this.message,
            senderId: this.senderId,
            type: "message",
          })
        );
      });
    }
  }
  private async handleOneToOneMessage() {
    await this.createChatRoom();
    await this.createParticipants();
    await this.createMessage();
    await this.responseMessage();
  }
  private async responseMessage() {
    if (this.receiveId && clients.get(this.receiveId)) {
      // send message to receiver it he/she is online
      clients.get(this.receiveId)?.send(
        JSON.stringify({
          message: this.message,
          senderId: this.senderId,
          type: "message",
        })
      );
      // here we need to update database if user is online
      await this.updateDeliverStatus();
    }
  }
  private async updateDeliverStatus() {
    if (this.receiveId && clients.get(this.receiveId)) {
      const message = await prisma.messaging.findFirst({
        where: {
          chatId: this.chatId,
          senderId: this.senderId,
        },
        orderBy: { createdAt: "desc" },
      });
      await prisma.messaging.update({
        data: { isDelivered: true },
        where: {
          id: message?.id,
        },
      });
      if(message?.id)
      chatStatusServer.broadCastMessageStatus(
        [this.senderId],
        [message?.id],
        "delivered"
      );
    }
  }
  private async createMessage() {
    const { content, iv, tag } = encrypt(this.message);

    try {
      await prisma.messaging.create({
        data: {
          senderId: this.senderId,
          chatId: this.chatId,
          message: content,
          iv,
          tag,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
  private async createChatRoom() {
    try {
      const data = await prisma.chatRoom.create({
        data: {
          chatId: this.chatId,
          chatType: "personal",
          cratedBy: this.senderId,
        },
      });
      if (data) console.log("chat room is created");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === "P2002") {
        return console.log("chat room already there ");
      }
    }
  }

  private async createParticipants() {
    if (this.receiveId)
      try {
        const data = await prisma.participant.createManyAndReturn({
          data: [
            {
              chatId: this.chatId,
              userId: this.senderId,
            },
            {
              chatId: this.chatId,
              userId: this.receiveId,
            },
          ],
          skipDuplicates: true,
        });
        if (data) console.log("Participants added to chat ");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
      }
  }
  private generateChatId() {
    const [minId, maxId] = [this.senderId, this.receiveId].sort();
    return `${minId}_${maxId}`;
  }
}
