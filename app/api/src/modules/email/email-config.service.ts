import { appError } from '../../core/utils/appError.js';
import { getTenantClient } from '@org/database';

export class EmailConfigService {
  static getEmailCredentials = async (organizationId: string) => {
    const tenantdb = getTenantClient(organizationId);
    const providerInfo = await tenantdb.emailProvider.findMany({
      where: { organizationId },
      orderBy: { priority: 'asc' },
    });
    if (providerInfo.length < 1) {
      throw new appError('Email Provider is not Active', 404, 'NOT_FOUND');
    }
    return providerInfo;
  };
}
