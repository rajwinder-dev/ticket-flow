import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";

export class EmailConfigService {
  static getEmailCredentials = async (organizationId: string) => {
    const providerInfo = await prisma.emailProvider.findMany({
      where: { organizationId },
    });
    if (providerInfo.length < 1) {
      throw new appError("Email Provider is not Active", 404, "NOT_FOUND");
    }

    const preferred = providerInfo.find((p) => p.providerType !== "SMTP");
    const fallback = providerInfo.find((p) => p.providerType === "SMTP");
    return { preferred, fallback };
  };
}
