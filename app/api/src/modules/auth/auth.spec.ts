import { describe, it, beforeAll, afterAll } from 'vitest';
import { app } from '../../app.js';
import { TestFactory } from '../../test/testFactory.js';
import { getOrgantionMock } from '../../test/helper/mock.helper.js';
import {
  AuthPermissions,
  CreateOrganizationInput,
  Permissions,
} from '@org/zod';
import { permissions } from '@org/constants';
import { getTenantClient } from '@org/database';
import { faker } from '@faker-js/faker';
import { readableId } from '../../core/utils/utils.js';
describe('protected route', () => {
  let memberId: string;
  let tenantDb: ReturnType<typeof getTenantClient>;
  const agent = new TestFactory(app);

  beforeAll(async () => {
    const orgData = getOrgantionMock();
    await agent.authenticate();

    const user = await agent.auth.createAuthUser();
    memberId = user.id;
    const data = await agent.post<CreateOrganizationInput>({
      path: '/org',
      body: orgData,
    });
    await agent.setOrgId(data.data.id);
    tenantDb = getTenantClient(agent.auth.getActiveOrg()!);
  });

  it('should get all premssions list', async () => {
    const { data } = await agent.get<AuthPermissions>({
      path: '/auth/permissions',
    });
    expect(data.permissions).toEqual(permissions);

    const role = await tenantDb.role.create({
      data: {
        createdBy: agent.auth.getUserData().id,
        name: faker.internet.userName(),
        organizationId: agent.auth.getActiveOrg()!,
        isSystem: false,
        code: readableId('ROL'),
        permissions: { activity: ['view'] } as Partial<Permissions>,
      },
    });
    await tenantDb.membership.create({
      data: {
        userId: memberId,
        roleId: role.id,
        organizationId: agent.auth.getActiveOrg()!,
      },
    });
  });

  // it('member should see own premssions list', async () => {
  //   await agent.authenticate({ userId: memberId });
  //   const { data } = await agent.get<AuthPermissions>({
  //     path: '/auth/permissions',
  //   });
  //   expect(data.permissions).toEqual(permissions);
  // });
});
