import { OnBoardUserInput, UpdateMyDetailsInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { ActivityService } from "../activity/activity.service";
import { OrganizationService } from "../organizations/organization.service";

export class UserService {
  static onboardUser = async (userId: string, data: OnBoardUserInput) => {
    const check = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isOnboarded: true,
      },
    });
    if (check?.isOnboarded) throw new appError("User already onboarded", 409, "CONFLICT_ERROR");
    const output = await OrganizationService.create(userId, data.organization);
    return output;
  };
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
}
