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

    const user = await agent.createUser();
    memberId = user.id;
    const data = await agent.post<CreateOrganizationInput>({
      path: '/org',
      body: orgData,
    });
    await agent.setOrgId(data.data.id);
    tenantDb = getTenantClient(agent.orgId!);
  });

  it('should get all premssions list', async () => {
    const { data } = await agent.get<AuthPermissions>({
      path: '/auth/permissions',
    });
    expect(data.permissions).toEqual(permissions);

    const role = await tenantDb.role.create({
      data: {
        createdBy: agent.getUserData().id,
        name: faker.internet.userName(),
        organizationId: agent.orgId,
        isSystem: false,
        code: readableId('ROL'),
        permissions: { activity: ['view'] } as Partial<Permissions>,
      },
    });
    const member = await tenantDb.membership.create({
      data: {
        userId: memberId,
        roleId: role.id,
        organizationId: agent.orgId,
      },
    });

    await agent.authenticate({ userId: member.userId });
  });
  it('should return joined orgainzations', async () => {
    const { data } = await agent.get<{ organizations: string[] }[]>({
      path: '/org/me',
    });
    expect(data.length).toBeGreaterThan(0);
  });
  it('member should see own premssions list', async () => {
    const { data } = await agent.get<AuthPermissions>({
      path: '/auth/permissions',
    });
    expect(data.permissions).toEqual({ activity: ['view'] });
  });
  it('menber should access premeted routes ', async () => {
    await agent.get({
      path: '/activity',
    });
  });
  it('member should not access unpremeted routes ', async () => {
    await agent.get({
      path: '/org',
      statusCode: 403,
    });
  });
});
