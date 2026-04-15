import { appError } from "../../core/utils/appError.js";
import { prisma } from "../../core/utils/prismaClient.js";

export class EmailConfigService {
  static getEmailCredentials = async (organizationId: string) => {
    const providerInfo = await prisma.emailProvider.findMany({
      where: { organizationId },
      orderBy: { priority: "asc" },
    });
    if (providerInfo.length < 1) {
      throw new appError("Email Provider is not Active", 404, "NOT_FOUND");
    }
    return providerInfo;
  };
}
