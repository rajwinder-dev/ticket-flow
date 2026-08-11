import { CreateOrganizationInput, CreateRoleInput } from '@org/zod';
import { TestFactory } from '../../test/testFactory';
import app from '../../app';
import { getOrgantionMock } from '../../test/helper/mock.helper';
import { faker } from '@faker-js/faker';
import { getTenantClient } from '@org/database';

describe('Roles  routes', () => {
  const agent = new TestFactory(app);
  let roleId: string;
  let memberId: string;
  beforeAll(async () => {
    const orgData = getOrgantionMock();
    await agent.authenticate();

    const user = await agent.auth.createOnlyUser();
    memberId = user.id;
    const data = await agent.post<CreateOrganizationInput>({
      path: '/org',
      body: orgData,
    });
    await agent.setOrgId(data.data.id);
  });

  it('should create role', async () => {
    const data = await agent.post<CreateRoleInput>({
      path: '/role',
      body: {
        name: faker.internet.userName(),
        description: faker.lorem.sentence(),
        permissions: {
          customer: ['create', 'edit', 'view_all'],
        },
      },
    });

    expect(data).toBeDefined();
  });
  it('should get all roles', async () => {
    const { data } = await agent.get<{ id: string }[]>({
      path: '/role',
    });
    console.log(data);
    expect(data.length).toBe(1);
    roleId = data[0].id;
    // create membership manually
    const tenantDb = getTenantClient(agent.auth.getActiveOrg()!);
    const member = await tenantDb.membership.create({
      data: {
        userId: memberId,
        roleId,
        organizationId: agent.auth.getActiveOrg()!,
      },
    });
    memberId = member.userId;
  });
  it('should update role allow activity', async () => {
    const { data } = await agent.patch<CreateRoleInput>({
      path: `/role/${roleId}`,
      body: {
        name: faker.internet.userName(),
        description: faker.lorem.sentence(),
        permissions: {
          activity: ['view'],
          customer: ['create', 'edit', 'view_all'],
        },
      },
    });
    expect(data.permissions).toEqual(
      expect.objectContaining({ activity: ['view'] }),
    );
  });
  it('delete should throw error if role already asigned', async () => {
    await agent.delete({
      path: `/role/${roleId}`,
      statusCode: 409,
    });
    const tenantDb = getTenantClient(agent.auth.getActiveOrg()!);
    await tenantDb.membership.deleteMany({
      where: {
        roleId: roleId,
      },
    });
  });
  it('should delete role', async () => {
    await agent.delete({
      path: `/role/${roleId}`,
    });
  });
});
