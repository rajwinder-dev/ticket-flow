import { z } from "zod";

export const groupChat = {
  bodySchema: z
    .object({
      groupName: z.string().min(1).max(50),
      users: z.array(z.number()),
    })
    .strict(),
};
export const messageSchema = z
  .object({
    message: z.string(),
    senderId: z.string(),
    receiveId: z.string().optional(),
    chatId: z.string().optional(),
    type: z.string(),
  }).strict()
  .refine((data) => data.receiveId !== undefined || data.chatId !== undefined, {
    message: "Either receiveId or chatId must be provided",
    path: ["receiveId"],
  });

export const messageStatus = z.object({
  senderId: z.number(),
  chatId: z.string(),
  type: z.string(),
}).strict();
