import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { decrypt } from "../../core/utils/crypto";
import { prisma } from "../../core/utils/prismaClient";
import { response } from "../../core/utils/response";
import { chatStatusServer } from "./chatStatus.service";
export class chatController {
  static getAllChatRooms = catchAsync(async (req, res, _next) => {
    const take = Number(req.query.limit) || 10;
    const skip = Number(req.query.offset) || 0;
    //   take this solution from ai
    const rows = (await prisma.$queryRawUnsafe(
      `SELECT DISTINCT ON (cr."chatId")
  cr."chatId",
  m."message",
  m."createdAt",
  m."isRead",
  m."isAchieve",
  e."firstName",
  e."lastName",
  e."image"
FROM "ChatRoom" cr
JOIN "Participant" p ON p."chatId" = cr."chatId"
JOIN "Employees" e ON e."id" = p."employeesId" AND p."employeesId" != $1
LEFT JOIN "Messaging" m ON m."chatId" = cr."chatId"
WHERE cr."chatId" IN (
  SELECT "chatId"
  FROM "Participant"
  WHERE "employeesId" = $1
)
ORDER BY cr."chatId", m."createdAt" DESC
LIMIT $2
OFFSET $3;
`,
      req.user.userId,
      take,
      skip,
    )) as Array<{
      chatId: string;
      message: string;
      createdAt: Date;
      readAt: Date | null;
      isRead: boolean;
      isAchieve: boolean;
      firstName: string;
      lastName: string;
      image: string | null;
    }>;
    // Format raw rows into structured objects
    const formattedData = rows.map((row) => ({
      chatId: row.chatId,
      message: row.message,
      createdAt: row.createdAt,
      readAt: row.readAt,
      isRead: row.isRead,
      isAchieve: row.isAchieve,
      sender: {
        firstName: row.firstName,
        lastName: row.lastName,
        image: row.image,
      },
    }));

    response(res, formattedData, 200, {
      otherFields: { limit: take, offset: skip },
    });
  });
  static getMessages = catchAsync(async (req, res, next) => {
    const take = Number(req.query.limit) || 10;
    const skip = Number(req.query.offset) || 0;
    const chatId = req.params.id as string;
    //*  we need to verify owner before sending chat data (later)

    const data = await prisma.messaging.findMany({
      where: { chatId },
      skip,
      take,
    });
    const output = data.map((item) => {
      const decryptedMessage = decrypt({
        iv: item.iv,
        content: item.message,
        tag: item.tag,
      });
      return {
        id: item.id,
        message: decryptedMessage,
        readAT: item.readAt,
        isRead: item.isRead,
        senderId: item.senderId,
        isDelivered: item.isDelivered,
      };
    });
    if (data.length < 1) return next(new appError("chatId not found ", 404));
    response(res, output, 200, {
      otherFields: { limit: take, offset: skip },
    });
  });
  static markDelivered = catchAsync(async (req, res, _next) => {
    const { messageIds } = req.body;

    const data = await prisma.messaging.updateManyAndReturn({
      where: {
        id: { in: messageIds },
        isDelivered: false,
      },
      data: { isDelivered: true },
    });
    //  broadcast notification message to the suers
    const senderIds = [...new Set(data.map((item) => item.senderId))];
    chatStatusServer.broadCastMessageStatus(senderIds, messageIds, "delivered");
    res.status(200).json({ success: true });
  });
  static markRead = catchAsync(async (req, res, _next) => {
    const messageIds = req.body.messageIds;
    const data = await prisma.messaging.updateManyAndReturn({
      where: {
        id: {
          in: messageIds,
        },
      },
      data: {
        readAt: new Date().toISOString(),
        isRead: true,
        isDelivered: true,
      },
    });
    // after update we need to broadcast message
    const senderIds = [...new Set(data.map((item) => item.senderId))];
    chatStatusServer.broadCastMessageStatus(senderIds, messageIds, "Read");
    response(res, data, 201);
  });
  static createGroup = catchAsync(async (req, res, next) => {
    const users: string[] = req.body.users;
    const chatId = users.sort().join("_");
    if (users.length < 3)
      return next(
        new appError("a group should contain attest 3 members ", 400),
      );

    // create chat room
    try {
      await prisma.chatRoom.create({
        data: {
          roomName: req.body.groupName,
          chatId,
          chatType: "group",
          cratedBy: req.user.userId,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === "P2002") {
        console.log("chat room already there ");
      }
    }
    const participants = users.map((userId) => ({ chatId, userId }));
    if (req.user.userId)
      participants.push({
        chatId,
        userId: req.user.userId,
      });

    const data = await prisma.participant.createManyAndReturn({
      data: participants,
      skipDuplicates: true,
    });
    console.log("Participant are created");
    response(res, data, 201);
  });
}
