import {
  CreateTicketInput,
  UpdateTicketInput,
} from '@org/zod';
import { faker } from '@faker-js/faker';
import { TestFactory } from '../../../test/testFactory';
import app from '../../../app';
import { dbTestHelpers } from '../../../test/helper/seed.helper';

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
const mockTicket = {
  subject: faker.lorem.sentence().slice(0, 40),
  description: faker.lorem.paragraph(),
  email: faker.internet.email(),
  priority: 'HIGH',
  category: 'BUG',
} as const;
describe('Ticket Routes', () => {
  const agent = new TestFactory(app);
  let ticketId: string;
  beforeAll(async () => {
    await agent.authenticate();
    const dbHelper = new dbTestHelpers(agent.getUserData().id);
    await dbHelper.createOrganization();

    agent.setOrgId(dbHelper.orgId!);
  });
  it('should create a ticket', async () => {
    const { data } = await agent.post<CreateTicketInput>({
      path: '/ticket',
      body: mockTicket,
    });
    ticketId = data.id;
    expect(data).toBeDefined();
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
  it('shoudl get ticket details', async () => {
    const { data } = await agent.get({
      path: `/ticket/${ticketId}`,
    });
    expect(data).toBeDefined();
  });
  it('shoud get ticket summary', async () => {
    const { data } = await agent.get<{ total: number }>({
      path: `/ticket/summary`,
    });
    expect(data).toHaveProperty('total');
    expect(data.total).toBeGreaterThanOrEqual(1);
  });
  it('should get all tickets', async () => {
    const { data } = await agent.get<{ id: string }[]>({
      path: '/ticket',
    });
    expect(data.length).toBeGreaterThanOrEqual(1);
  });
});
