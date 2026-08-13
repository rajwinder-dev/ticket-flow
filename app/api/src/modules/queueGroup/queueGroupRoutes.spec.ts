import app from '../../app';
import { TestFactory } from '../../test/testFactory';
import {
  CreateQueueGroupInput,
  QueueGroupSchemaResponse,
  UpdateQueueInput,
} from '@org/zod';
import { dbTestHelpers } from '../../test/helper/seed.helper';
import { faker } from '@faker-js/faker';

describe('Queue Group', () => {
  let queueGroupId: string;
  const agent = new TestFactory(app);
  beforeAll(async () => {
    await agent.authenticate();
    const dbHelper = new dbTestHelpers(agent.getUserData().id);
    const organization = await dbHelper.createOrganization();
    agent.setOrgId(organization[0].organization.id);
  });
  afterAll(async () => {});
  it('create a queue group', async () => {
    const data = await agent.post<CreateQueueGroupInput>({
      path: '/queue-group',
      body: {
        name: faker.person.jobTitle(),
        description: 'description',
      },
    });

    expect(data).toBeDefined();
    console.log(data);
    queueGroupId = data.data.id;
  });
  it('should get all queues', async () => {
    const { data } = await agent.get<QueueGroupSchemaResponse[]>({
      path: `/queue-group`,
    });
    expect(data[0].default).toBe(true);
    expect(data.length).toBe(1);
  });
  it('should upate group', async () => {
    const { data } = await agent.patch<UpdateQueueInput>({
      path: `/queue-group/${queueGroupId}`,
      statusCode: 200,
      body: { name: 'queue group', description: 'new description' },
    });
    expect(data.description).toBe('new description');
  });
  it('the default groupd should be chaned', async () => {
    const { data } = await agent.get<QueueGroupSchemaResponse[]>({
      path: `/queue-group`,
    });
    expect(data[0].default).toBe(true);
    expect(data).toBeDefined();
  });
  it('should delete queue', async () => {
    await agent.delete({
      path: `/queue-group/${queueGroupId}`,
    });
  });
  it('deleted row should not be found', async () => {
    const { data } = await agent.get<QueueGroupSchemaResponse[]>({
      path: `/queue-group`,
    });
    expect(data.length).toBe(0);
  });
});
