import {
  CreateEmailProviderInput,
  CreateOrganizationInput,
  CreateSmtpInput,
  EmailProviderSchema,
  UpdateEmailProviderInput,
} from '@org/zod';
import { TestFactory } from '../../test/testFactory';
import app from '../../app';
import { getOrgantionMock, getRandomUser } from '../../test/helper/mock.helper';
import { faker } from '@faker-js/faker';
import { getTenantClient } from '@org/database';

describe('Email routes', () => {
  const agent = new TestFactory(app);
  let tenantDb: ReturnType<typeof getTenantClient>;
  let memberId: string;
  let providerId: string;
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
    tenantDb = getTenantClient(data.data.id);
  });
  afterAll(async () => {
    await tenantDb.emailProvider.deleteMany({
      where: {
        organizationId: agent.orgId,
      },
    });
  });
  it('should create a smpt provider', async () => {
    const { data } = await agent.post<CreateSmtpInput>({
      path: '/email/smtp',
      body: {
        fromEmail: getRandomUser().email,
        credentials: {
          user: faker.internet.userName(),
          port: faker.datatype.number({ min: 1024, max: 65535 }),
          host: faker.internet.url(),
          pass: faker.internet.password(),
        },
      },
    });
  });
  it('should create external email provider eg RESEND', async () => {
    const data = await agent.post<CreateEmailProviderInput>({
      path: '/email',
      body: {
        providerType: 'RESEND',
        fromEmail: getRandomUser().email,
        webhookSecret: faker.datatype.string(),
        credentials: {
          apiKey: faker.datatype.string(),
        },
      },
    });
    const emailProvider = await tenantDb.emailProvider.findFirst({
      where: {
        id: data.id,
      },
    });

    providerId = data.id;
    expect(emailProvider).toBeDefined();
  });
  it('should throw error when privder limti reached', async () => {
    await agent.post<CreateEmailProviderInput>({
      path: '/email',
      body: {
        providerType: 'RESEND',
        fromEmail: getRandomUser().email,
        webhookSecret: faker.datatype.string(),
        credentials: {
          apiKey: faker.datatype.string(),
        },
      },
      statusCode: 403,
    });
  });
  it('should return all providers', async () => {
    const { data } = await agent.get<EmailProviderSchema[]>({
      path: '/email',
    });
    providerId = data.find((d) => d.providerType === 'RESEND')!.id;
    expect(data.length).toBeGreaterThan(0);
  });
  it('shuould update email provider', async () => {
    let email = getRandomUser().email;
    let webhook = faker.datatype.string();
    await agent.patch<UpdateEmailProviderInput>({
      path: `/email/${providerId}`,
      body: {
        providerType: 'RESEND',
        fromEmail: email,
        webhookSecret: webhook,
        credentials: {
          apiKey: faker.datatype.string(),
        },
      },
    });
    const emailProvider = await tenantDb.emailProvider.findFirst({
      where: {
        id: providerId,
      },
    });
    expect(emailProvider).toEqual(
      expect.objectContaining({ fromEmail: email.toLowerCase() }),
    );
  });
});
