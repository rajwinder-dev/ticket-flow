import { getTenantClient } from '@org/database';
import app from '../../app';
import { TestFactory } from '../../test/testFactory';
import {
  InviteMemberDetailsResponse,
  InviteUserOrganizationInput,
} from '@org/zod';
import { TokenService } from '../token/token.service';
import { faker } from '@faker-js/faker';
import { getRoleMock } from '../../test/helper/mock.helper';
import { EmailService } from '../email/email.service';
import { dbTestHelpers } from '../../test/helper/seed.helper';
vi.spyOn(EmailService, 'queueEmail').mockResolvedValue('string');
const tokenSpy = vi.spyOn(TokenService, 'createToken');

describe('inviteRoutes', () => {
  const inviteEmail = faker.internet.email();
  let roleId: string;
  const agent = new TestFactory(app);
  let token: string;
  const roleData = getRoleMock();
  beforeAll(async () => {
    await agent.authenticate();
    const dbHelpers = new dbTestHelpers(agent.getUserData().id);
    const organization = await dbHelpers.createOrganization();
    agent.setOrgId(organization[0].organization.id);
    const user = agent.getUserData();
    const tenantDb = getTenantClient(agent.orgId);
    const role = await tenantDb.role.create({
      data: {
        createdBy: user.id,
        name: roleData.name,
        organizationId: agent.orgId,
        isSystem: false,
        code: roleData.code,
        permissions: [],
      },
    });
    roleId = role.id;
  });
  afterAll(async () => {});
  it('should invite a user', async () => {
    const data = await agent.post<InviteUserOrganizationInput>({
      path: '/invite',
      body: { email: inviteEmail, roleId },
      statusCode: 200,
    });
    expect(data).toBeDefined();
    const result = await tokenSpy.mock.results[0].value;
    token = result.token;
  });
  it('should not accept invite form another user', async () => {
    const data = await agent.post({
      path: `/invite/${token}`,
      statusCode: 403,
    });
    expect(data).toBeDefined();
  });
  it('should fetch invite details', async () => {
    const data = await agent.get<InviteMemberDetailsResponse>({
      path: `/invite/${token}`,
      statusCode: 200,
    });

    await agent.authenticate({ data: { email: data.data.invitedTo } });

    expect(data).toBeDefined();
  });
  it('should accept invite', async () => {
    const data = await agent.post({
      path: `/invite/${token}`,
      statusCode: 200,
    });
    expect(data).toBeDefined();
  });
  it('user become part of orgaitnization', async () => {
    const { data } = await agent.get<{ id: string }[]>({
      path: '/org/me',
    });
    expect(data.length).toBeGreaterThan(0);
  });
  it('should return invilid error if invite is already accepted', async () => {
    await agent.get({
      path: `/invite/${token}`,
      statusCode: 400,
    });
  });
});
