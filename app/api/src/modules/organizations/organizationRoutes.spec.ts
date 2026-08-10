import { TestFactory } from '../../test/testFactory';
import app from '../../app';
import { faker } from '@faker-js/faker';
import { CreateOrganizationInput, UpdateOrganizationInput } from '@org/zod';
import { getTenantClient } from '@org/database';
describe('Organization routes', () => {
  const agent = new TestFactory(app);
  beforeAll(async () => {
    await agent.authenticate();
  });
  afterAll(async () => {
    const orgId = agent.auth.getActiveOrg()!;
    const tenantDb = getTenantClient(orgId);
    await tenantDb.membership.deleteMany({
      where: {
        organizationId: orgId,
      },
    });
    await tenantDb.role.deleteMany({
      where: {
        organizationId: orgId,
      },
    });

    await tenantDb.organization.deleteMany({
      where: {
        id: orgId,
      },
    });
    await agent.cleanup();
  });
  const orgName = faker.company.name();
  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-') // spaces/underscores → -
      .replace(/[^\w-]+/g, '') // remove special characters
      .replace(/--+/g, '-') // collapse multiple -
      .replace(/^-+|-+$/g, ''); // trim -
  }
  it('should create an organization', async () => {
    const data = await agent.post<CreateOrganizationInput>({
      path: '/org',
      body: { name: orgName, type: 'PERSONAL', slug: slugify(orgName) },
    });
    expect(data).toBeDefined();
  });
  it('should get all my organizations', async () => {
    const { data } = await agent.get<{ id: string }[]>({ path: '/org/me' });
    expect(data.length).toBeDefined();
    await agent.setOrgId(data[0].id);
  });
  it('should get current organization', async () => {
    const { data } = await agent.get<{ id: string }>({ path: '/org/current' });
    expect(data).toBeDefined();
  });
  it('should upate current organization', async () => {
    const newOrgName = faker.company.name();
    const { data } = await agent.patch<UpdateOrganizationInput>({
      path: '/org',
      body: {
        name: newOrgName,
        slug: slugify(newOrgName),
        logo: 'https://example.com/logo.png',
        description: 'test description',
        teamSize: 10,
      },
    });
    expect(data).toBeDefined();
  });
  it('should delete current organization', async () => {
    await agent.delete({ path: '/org' });
  });
  it('should return no organizations', async () => {
    const { data } = await agent.get<{ id: string }[]>({ path: '/org/me' });
    expect(data.length).toBe(0);
  });
});
