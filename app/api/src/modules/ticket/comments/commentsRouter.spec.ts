import { CreateOrganizationInput, CreateTicketCommentInput } from '@org/zod';
import { faker } from '@faker-js/faker';
import { getTenantClient } from '@org/database';
import { TestFactory } from '../../../test/testFactory';
import app from '../../../app';
import { getOrgantionMock } from '../../../test/helper/mock.helper';
import { readableId } from '../../../core/utils/utils';

describe('Ticket comments', () => {
  const agent = new TestFactory(app);
  let ticketId: string;

  let memberId: string;
  beforeAll(async () => {
    const orgData = getOrgantionMock();
    await agent.authenticate();
    const data = await agent.post<CreateOrganizationInput>({
      path: '/org',
      body: orgData,
    });
    agent.setOrgId(data.data.id);
    const tenantDb = getTenantClient(data.data.id);
    const ticket = await tenantDb.ticket.create({
      data: {
        subject: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        organizationId: agent.orgId,
        code: readableId('TKT'),
        priority: 'HIGH',
        status: 'OPEN',
      },
    });
    const role = await tenantDb.role.create({
      data: {
        createdBy: agent.getUserData().id,
        name: faker.internet.userName(),
        code: readableId('ROLE'),
        organizationId: agent.orgId,
        isSystem: false,
        permissions: {
          comment: ['create'],
        },
      },
    });
    const newUser = await agent.createUser();
    const membership = await tenantDb.membership.create({
      data: {
        userId: newUser.id,
        roleId: role.id,
        organizationId: agent.orgId,
      },
    });
    memberId = membership.userId;
    ticketId = ticket.id;
  });
  it('should create comment', async () => {
    const { data } = await agent.post<CreateTicketCommentInput>({
      path: `/ticket/${ticketId}/comment`,
      body: {
        id: crypto.randomUUID(),
        comment: faker.lorem.sentence(),
      },
    });
    expect(data).toBeDefined();
    expect(data.authorId).toEqual(agent.getUserData().id);
  });
  it('mamber should create comment', async () => {
    await agent.authenticate({ userId: memberId });
    const { data } = await agent.post<CreateTicketCommentInput>({
      path: `/ticket/${ticketId}/comment`,
      body: {
        id: crypto.randomUUID(),
        comment: faker.lorem.sentence(),
      },
    });
    expect(data).toBeDefined();
    expect(data.authorId).toEqual(memberId);
  });
  it('should get all ticket comments', async () => {
    const { data } = await agent.get<{ id: string }[]>({
      path: `/ticket/${ticketId}/comment`,
    });
    expect(data.length).toBe(2);
  });
});
