import { getTenantClient } from '@org/database';

export default class AuthService {
  static async getPermissions(userId: string, organizationId: string) {
    const tenantDb = getTenantClient(organizationId);
    const permissions = await tenantDb.membership.findUnique({
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
    const tenantDb = getTenantClient(organizationId);
    return await tenantDb.membership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
  }
}
