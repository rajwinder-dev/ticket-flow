import { prisma } from '@org/database';

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
  static async CheakUserORganization({
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  }) {
    return await prisma.membership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
  }
}
