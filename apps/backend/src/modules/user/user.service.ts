import { UpdateMyDetailsInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError.js";
import { prisma } from "../../core/utils/prismaClient.js";
import { ActivityService } from "../activity/activity.service.js";

export class UserService {
  static getDetails = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new appError("User missing after auth", 500);

    return user;
  };
  static updateDetails = async (userId: string, input: UpdateMyDetailsInput) => {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    const updatedUser = await prisma.user.update({
      data: input,
      where: {
        id: userId,
      },
    });
    await ActivityService.lagActivity({
      actorId: userId,
      actorType: "USER",
      message: "user details updated ",
      event: "ticket.agent.assigned",
      entityId: userId,
      entityType: "USER",
      oldData: existingUser,
      newData: updatedUser,
    });
    return updatedUser;
  };
  static checkExist = async ({email, username}: {email: string; username: string}) => {
        const existingUsers = await prisma.user.findMany({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        email: true,
        username: true,
      },
    });

    const conflicts: string[] = [];

    for (const user of existingUsers) {
      if (user.email === email) conflicts.push("email");
      if (user.username === username) conflicts.push("username");
    }
      return conflicts;
  }
}
