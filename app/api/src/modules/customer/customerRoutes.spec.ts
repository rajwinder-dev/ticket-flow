import {
  CreateCustomerInput,
  CustomerSchemaResponse,
  UpdateCustomerInput,
} from '@org/zod';
import { TestFactory } from '../../test/testFactory';
import app from '../../app';
import { getOrgantionMock } from '../../test/helper/mock.helper';
import { faker } from '@faker-js/faker';
import { getTenantClient } from '@org/database';

describe('Customer routes', () => {
  const agent = new TestFactory(app);
  let customerId: string;
  let tenantDb: ReturnType<typeof getTenantClient>;
  beforeAll(async () => {
    const orgData = getOrgantionMock();
    await agent.authenticate();
    const data = await agent.post({
      path: '/org',
      body: orgData,
    });
    await agent.setOrgId(data.data.id);
    tenantDb = getTenantClient(data.data.id);
  });

  afterAll(async () => {
    await tenantDb.customer.deleteMany({
      where: {
        organizationId: agent.auth.getActiveOrg()!,
      },
    });
  });
  it('should create customer', async () => {
    const { data } = await agent.post<CreateCustomerInput>({
      path: '/customer',
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.internet.url(),
      },
    });

    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
    console.log(data);
    customerId = data.id;
  });

  it('should fail to create customer with invalid email', async () => {
    await agent.post({
      path: '/customer',
      body: {
        name: faker.person.fullName(),
        email: 'not-an-email',
      },
      statusCode: 400,
    });
  });

  it('should fail to create customer without required fields', async () => {
    await agent.post({
      path: '/customer',
      body: {
        email: faker.internet.email(),
      },
      statusCode: 400,
    });
  });

  it('should get all customers', async () => {
    const { data } = await agent.get<CustomerSchemaResponse[]>({
      path: '/customer',
    });

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
    const found = data.find((c) => c.id === customerId);
    expect(found).toBeDefined();
  });

  it('should update customer', async () => {
    const updatedName = faker.person.fullName();
    const { data } = await agent.patch<UpdateCustomerInput>({
      path: `/customer/${customerId}`,
      body: {
        name: updatedName,
        avatarUrl: null,
      },
    });

    expect(data.name).toBe(updatedName.toLowerCase());
    expect(data.avatarUrl).toBeNull();
  });

  it('should fail to update customer with invalid phone', async () => {
    await agent.patch({
      path: `/customer/${customerId}`,
      body: {
        name: faker.person.fullName(),
        phone: 'not-a-phone-number',
      },
      statusCode: 400,
    });
  });

  it('should return 404 when updating a non-existent customer', async () => {
    await agent.patch({
      path: `/customer/${faker.string.uuid()}`,
      body: {
        name: faker.person.fullName(),
      },
      statusCode: 404,
    });
  });

  it('member without permission cannot access customer routes', async () => {
    const memberAgent = new TestFactory(app);
    await memberAgent.authenticate();
    // switch to same org but without granted 'customer' permissions
    await memberAgent.setOrgId(agent.auth.getActiveOrg()!);

    await memberAgent.get({
      path: '/customer',
      statusCode: 403,
    });
  });
});
