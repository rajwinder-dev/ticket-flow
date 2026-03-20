import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";

export class EmailConfigService {
  static getEmailCredentials = async (organizationId: string) => {
    const providerInfo = await prisma.emailProvider.findFirst({
      where: { organizationId },
    });
    if (!providerInfo) throw new appError("Email Provider is not Active", 404, "NOT_FOUND");
    return providerInfo;
  };
}
