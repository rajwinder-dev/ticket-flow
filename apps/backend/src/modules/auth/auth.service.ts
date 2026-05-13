import { prisma } from "../../core/utils/prismaClient.js";
export default class AuthService {
  static async getPermissions(userId: string, organizationId: string) {
    const permissions = await prisma.membership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      include: {
        role: true,
      },
    });
    return { permissions: permissions?.role?.permissions };
  }
}
