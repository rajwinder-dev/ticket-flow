import { OnBoardUserInput } from "@repo/schemas";
import { Organization, User } from "../../../generated/prisma";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";

export class UserService {
  static userHandler = new HandleFactory<User>(prisma.user);
  static organizationHandler = new HandleFactory<Organization>(prisma.organization);
  static onboardUser = async (userId: string, data: OnBoardUserInput) => {
    const updateUser = await this.userHandler.update(userId, { ...data.user, isOnboarded: true });
    const organization = await this.organizationHandler.create({
      id: updateUser.id,
      ...data.organization,
    });
    return organization;
  };
}
