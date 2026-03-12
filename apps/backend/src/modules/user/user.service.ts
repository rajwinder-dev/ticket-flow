import { OnBoardUserInput } from "@repo/schemas";
import { Prisma } from "../../../generated/prisma";
import { appError } from "../../core/utils/appError";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";

export class UserService {
  static userHandler = new HandleFactory<Prisma.UserUncheckedCreateInput>(prisma.user);
  static organizationHandler = new HandleFactory<Prisma.OrganizationUncheckedCreateInput>(
    prisma.organization,
  );
  static onboardUser = async (userId: string, data: OnBoardUserInput) => {
    const check = await this.userHandler.getOne(userId, {
      select: {
        isOnboarded: true,
      },
    });
    if (check.isOnboarded) throw new appError("User already onboarded", 409, "CONFLICT_ERROR");

    const organization = await this.organizationHandler.create({
      createdBy: userId,
      ...data.organization,
      code: readableId("ORG"),
    });
    const user = await this.userHandler.update(userId, { ...data.user, isOnboarded: true });
    return { user, organization };
  };
}
