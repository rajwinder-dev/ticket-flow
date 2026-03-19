import { OnBoardUserInput, UpdateUserInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
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
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  };
  static updateDetails = async (userId: string, input: UpdateUserInput) => {
    return await prisma.user.update({
      data: input,
      where: {
        id: userId,
      },
    });
  };
}
