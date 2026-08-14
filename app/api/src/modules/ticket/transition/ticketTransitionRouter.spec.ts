import { permissions } from '@org/constants';
import app from '../../../app';
import { dbTestHelpers } from '../../../test/helper/seed.helper';
import { TestFactory } from '../../../test/testFactory';
import { faker } from '@faker-js/faker';
import {
  CreateTicketInput,
  EscalateTicketInput,
  TicketEscalationOptions,
  UpdateTicketInput,
  UpdateTicketStatusInput,
} from '@org/zod';
import { getTenantClient, TenantClient } from '@org/database';
vi.mock('../../ai/ai.service.ts', () => ({
  AiService: {
    generateGeminiResponse: vi.fn().mockResolvedValue({
      sentiment: 'POSITIVE',
      keywords: ['keyword1', 'keyword2'],
      summary: 'summary',
      priority: 'HIGH',
      groupId: null,
    }),
  },
}));

const agent = new TestFactory(app);
describe('TicketTransitionRouter', () => {
  let tenantDb: TenantClient;
  let ticketId: string;
  let ticketAssignedTo: string;
  let memberIds: string[] = [];
  beforeAll(async () => {
    await agent.authenticate();
    const dbHelper = new dbTestHelpers(agent.getUserData().id);
    const organization = await dbHelper.createOrganization();
    agent.setOrgId(organization[0].organization.id);
    tenantDb = getTenantClient(organization[0].organization.id);
    const role = await dbHelper.createroles({
      permissions: { ticket: permissions.ticket },
    });
    for (let i = 0; i < 8; i++) {
      const user = await agent.createUser();
      memberIds.push(user.id);
    }
    await dbHelper.createMembership({
      userIds: memberIds,
      roleId: role.id,
    });
    const groups = await dbHelper.createGroups({ count: 2 });
    const group1Queues = await dbHelper.createQueues({
      groupId: groups[0].id,
      count: 2,
    });
    const group2Queues = await dbHelper.createQueues({
      groupId: groups[1].id,
      count: 2,
    });
    const queues = [...group1Queues, ...group2Queues];
    const memberPairs = Array.from(
      { length: Math.ceil(memberIds.length / 2) },
      (_, i) => memberIds.slice(i * 2, i * 2 + 2),
    );
    for (let i = 0; i < memberPairs.length; i++) {
      await dbHelper.assignUserQueue({
        queueId: queues[i].id,
        agentIds: memberPairs[i],
      });
    }
  });
  it('should create a ticket', async () => {
    const { data } = await agent.post<CreateTicketInput>({
      path: '/ticket',
      body: {
        subject: faker.lorem.sentence().slice(0, 40),
        description: faker.lorem.paragraph(),
        priority: 'HIGH',
        category: 'BUG',
        email: faker.internet.email(),
      },
    });
    expect(data).toBeDefined();
    ticketId = data.id;
    ticketAssignedTo = data.assignedTo;
    const agentData = await tenantDb.queueAgent.findFirst({
      where: {
        agentId: data.assignment.agentId,
        organizationId: data.organizationId,
      },
    });
    expect(agentData?.ticketCount).toBe(1);
  });
  it('should update ticket', async () => {
    let description = faker.lorem.paragraph();
    const { data } = await agent.patch<UpdateTicketInput>({
      path: `/ticket/${ticketId}`,
      body: {
        description,
        version: 1,
      },
    });
    expect(data).toBeDefined();
    expect(data.description).toBe(description);
  });
  it('should change priority of ticket', async () => {
    const { data } = await agent.patch<UpdateTicketInput>({
      path: `/ticket/${ticketId}/priority`,
      body: {
        priority: 'LOW',
        version: 2,
      },
    });
    expect(data).toBeDefined();
  });
  it('should change status of ticket', async () => {
    const { data } = await agent.patch<UpdateTicketStatusInput>({
      path: `/ticket/${ticketId}/status`,
      body: {
        status: 'IN_PROGRESS',
        version: 3,
      },
    });
    expect(data).toBeDefined();
    expect(data.status).toBe('IN_PROGRESS');
  });
  it('should return next queue exit', async () => {
    const { data } = await agent.get<TicketEscalationOptions>({
      path: `/ticket/${ticketId}/escalate-options`,
    });
    expect(data.groupIdRequired).toBe(false);
    expect(data).toHaveProperty('nextQueue');
  });
  it('should escalate ticket', async () => {
    const { data } = await agent.post<EscalateTicketInput>({
      path: `/ticket/${ticketId}/escalate`,
      body: {
        reason: 'sla-breach',
        priority: 'HIGH',
        comment: 'Escalating',
      },
      statusCode: 200,
    });
    expect(data).toBeDefined();
    expect(data.priority).toBe('HIGH');
    expect(data.assignedTo).not.toBe(ticketAssignedTo);
    const agentData = await tenantDb.queueAgent.findFirst({
      where: {
        agentId: ticketAssignedTo,
        organizationId: data.organizationId,
      },
    });

    expect(agentData?.ticketCount).toBe(0);
    ticketAssignedTo = data.assignedTo;
    const newAgentData = await tenantDb.queueAgent.findFirst({
      where: {
        agentId: data.assignedTo,
        organizationId: data.organizationId,
      },
    });
    expect(newAgentData?.ticketCount).toBe(1);
  });
  it('should return next queue as not exist', async () => {
    const { data } = await agent.get<TicketEscalationOptions>({
      path: `/ticket/${ticketId}/escalate-options`,
    });
    expect(data.groupIdRequired).toBe(true);
    expect(data).toHaveProperty('currentQueue');
  });
  it('should throw error for groupId if no further queue', async () => {
    await agent.post<EscalateTicketInput>({
      path: `/ticket/${ticketId}/escalate`,
      body: {
        reason: 'sla-breach',
        priority: 'HIGH',
        comment: 'Escalating',
      },
      statusCode: 400,
    });
  });
  it('should close the ticket', async () => {
    const { data } = await agent.patch<UpdateTicketStatusInput>({
      path: `/ticket/${ticketId}/status`,
      body: {
        status: 'CLOSED',
        version: 4,
      },
    });
    expect(data).toBeDefined();
    expect(data.status).toBe('CLOSED');
    const agentData = await tenantDb.queueAgent.findFirst({
      where: {
        agentId: ticketAssignedTo,
        organizationId: data.organizationId,
      },
    });
    expect(agentData?.ticketCount).toBe(0);
  });
  it('should get ticket history', async () => {
    const { data } = await agent.get<{ id: string }[]>({
      path: `/ticket/${ticketId}/transitions`,
    });
    expect(data.length).toBe(5);
  });
  // it('ticket can be assigned directly to agent by admin', async () => {
  //   let assignId = memberIds[4];
  //   const { data } = await agent.patch<AssignTicketInput>({
  //     path: `/ticket/${ticketId}/assign`,
  //     body: {
  //       assignId,
  //       targetType: 'AGENT',
  //       // version: 6,
  //     },
  //   });
  //   expect(data.assignedTo).toBe(assignId);
  // });
});
