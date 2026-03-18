import { OnBoardUserInput } from "@repo/schemas";
import { Prisma } from "../../../generated/prisma";
import { appError } from "../../core/utils/appError";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import { OrganizationService } from "../organizations/organization.service";

export class UserService {
  static userHandler = new HandleFactory<Prisma.UserUncheckedCreateInput>(prisma.user);
  static roleHandler = new HandleFactory<Prisma.RoleUncheckedCreateInput>(prisma.role);
  static memberShipHandler = new HandleFactory<Prisma.MembershipUncheckedCreateInput>(
    prisma.membership,
  );
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
    const output = await OrganizationService.create(userId, data.organization);
    return output;
  };
}
