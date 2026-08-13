import app from '../../app';
import { TestFactory } from '../../test/testFactory';
import {
  AddAgentsToQueueInput,
  CreateQueueInput,
  QueueSchemaResponse,
  QueueSummarySchema,
  RemoveAgentsFromQueueInput,
} from '@org/zod';
import { dbTestHelpers } from '../../test/helper/seed.helper';

describe('Queues ', () => {
  let groupId: string;
  let queueId: string;
  let memberId: string;
  const agent = new TestFactory(app);
  beforeAll(async () => {
    await agent.authenticate();
    const dbHelpers = new dbTestHelpers(agent.getUserData().id);
    const organization = await dbHelpers.createOrganization();
    agent.setOrgId(organization[0].organization.id);
    const queuesGroups = await dbHelpers.createGroups();
    groupId = queuesGroups[0].id;
    const user = await agent.createUser();
    const role = await dbHelpers.createroles({
      permissions: {},
    });

    try {
      const member = await dbHelpers.createMembership({
        userIds: [user.id],
        orgId: agent.orgId,
        roleId: role.id,
      });

      memberId = member[0].userId;
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
