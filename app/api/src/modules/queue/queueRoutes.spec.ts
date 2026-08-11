import app from '../../app';
import { TestFactory } from '../../test/testFactory';
import {
  AddAgentsToQueueInput,
  CreateOrganizationInput,
  CreateQueueInput,
  QueueSchemaResponse,
  QueueSummarySchema,
  RemoveAgentsFromQueueInput,
} from '@org/zod';
import { getOrgantionMock } from '../../test/helper/mock.helper';
import { getTenantClient } from '@org/database';
import { faker } from '@faker-js/faker';
import { readableId } from '../../core/utils/utils';

describe('Queues ', () => {
  let groupId: string;
  let queueId: string;
  let memberId: string;
  const agent = new TestFactory(app);
  const orgData = getOrgantionMock();
  beforeAll(async () => {
    await agent.authenticate();
    const data = await agent.post<CreateOrganizationInput>({
      path: '/org',
      body: orgData,
    });
    await agent.setOrgId(data.data.id);
    const tenantDb = getTenantClient(data.data.id);
    const queuesGroups = await tenantDb.queueGroup.createManyAndReturn({
      data: [
        {
          organizationId: data.data.id,
          name: 'group 1',
          description: 'description 1',
          default: true,
        },
      ],
    });
    groupId = queuesGroups[0].id;
    const user = await agent.auth.createAuthUser();
    const role = await tenantDb.role.create({
      data: {
        createdBy: user.id,
        name: faker.internet.userName(),
        organizationId: data.data.id,
        isSystem: false,
        code: readableId('ROL'),
        permissions: [],
      },
    });

    try {
      let member = await tenantDb.membership.findUnique({
        where: {
          organizationId_userId: {
            organizationId: data.data.id,
            userId: user.id,
          },
        },
      });
      if (!member) {
        member = await tenantDb.membership.create({
          data: {
            organizationId: data.data.id,
            userId: user.id,
            roleId: role.id,
          },
        });
      }

      memberId = member.userId;
    } catch (error) {
      // console.log(error);
    }
  });
  afterAll(async () => {});
  it('create a queue', async () => {
    const data = await agent.post<CreateQueueInput>({
      path: `/queue/${groupId}`,
      body: {
        name: 'queue 1',
        description: 'description this is a queue',
      },
    });
    expect(data).toBeDefined();
  });
  it('should get all queues in group', async () => {
    const { data } = await agent.get<QueueSchemaResponse[]>({
      path: `/queue/${groupId}`,
    });
    expect(data.length).toBe(1);
    queueId = data[0].id;
  });
  it('should update a queue', async () => {
    const data = await agent.patch<CreateQueueInput>({
      path: `/queue/${queueId}`,
      body: {
        name: 'queue 1',
        description: 'updated description',
      },
    });
    expect(data).toBeDefined();
  });
  it('shoud get updated queue details', async () => {
    const { data } = await agent.get<QueueSchemaResponse>({
      path: `/queue/${queueId}/details`,
    });
    expect(data).toEqual(
      expect.objectContaining({ description: 'updated description' }),
    );
  });
  it('should assign queue to agent', async () => {
    const data = await agent.post<AddAgentsToQueueInput>({
      path: `/queue/${queueId}/agents`,
      body: {
        agentIds: [memberId],
      },
      statusCode: 200,
    });
    expect(data).toBeDefined();
  });
  it('should return queue summary with member ', async () => {
    const { data } = await agent.get<QueueSummarySchema>({
      path: `/queue/${queueId}/summary`,
    });
    expect(data.activeAgents).toBe(1);
  });
  it('should requrn agents list of queue', async () => {
    const { data } = await agent.get<{ id: string }[]>({
      path: `/queue/${queueId}/agents`,
    });
    expect(data.length).toBe(1);
  });
  it('should throw conflit error on queue with agents ', async () => {
    await agent.delete({
      path: `/queue/${queueId}`,
      statusCode: 409,
    });
  });

  it('shoud remove agent from queue', async () => {
    await agent.patch<RemoveAgentsFromQueueInput>({
      path: `/queue/${queueId}/agents`,
      body: {
        agentIds: [memberId],
      },
    });
  });
  it('active agents should be zero', async () => {
    const { data } = await agent.get<QueueSummarySchema>({
      path: `/queue/${queueId}/summary`,
    });
    expect(data.activeAgents).toBe(0);
  });
  it('should delete queue', async () => {
    await agent.delete({
      path: `/queue/${queueId}`,
    });
  });
});
