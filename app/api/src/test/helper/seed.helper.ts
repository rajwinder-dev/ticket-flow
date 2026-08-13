import { faker } from '@faker-js/faker';
import { OrganizationService } from '../../modules/organizations/organization.service';
import { slugify } from './mock.helper';
import { QueueGroupService } from '../../modules/queueGroup/queueGroup.service';
import { QueueService } from '../../modules/queue/queue.service';
import { CustomerService } from '../../modules/customer/customer.service';
import { getTenantClient, ProviderType } from '@org/database';
import { RoleService } from '../../modules/role/role.service';
import { EmailService } from '../../modules/email/email.service';
import { TicketService } from '../../modules/ticket/ticket/ticket.service';

// TODO:  make it independent from api modules

export class dbTestHelpers {
  ownerId: string;
  orgId?: string;
  constructor(ownerId: string) {
    this.ownerId = ownerId;
  }
  async setORgId(orgId: string) {
    this.orgId = orgId;
  }
  async createOrganization({ count = 1 }: { count?: number } = {}) {
    let result = [];
    for (let i = 0; i < count; i++) {
      const name = faker.company.name();
      const data = await OrganizationService.create(this.ownerId, {
        name,
        type: 'PERSONAL',
        slug: slugify(name),
        description: faker.lorem.sentence(),
        teamSize: 1,
      });

      result.push(data);
    }
    this.setORgId(result[0].organization.id);
    return result;
  }
  async createGroups({ count = 1 }: { count?: number } = {}) {
    if (!this.orgId) throw new Error('orgId is not set');
    let result = [];
    for (let i = 0; i < count; i++) {
      const data = await QueueGroupService.createQueueGroup({
        userId: this.ownerId,
        organizationId: this.orgId,
        input: {
          name: faker.person.jobTitle(),
          description: faker.lorem.sentence(),
        },
      });
      result.push(data);
    }
    return result;
  }
  async createQueues({
    groupId,
    count = 1,
  }: {
    groupId: string;
    count?: number;
  }) {
    if (!this.orgId) throw new Error('orgId is not set');
    let result = [];
    for (let i = 0; i < count; i++) {
      const data = await QueueService.create({
        organizationId: this.orgId,
        queueGroupId: groupId,
        userId: this.ownerId,
        input: {
          name: faker.person.jobTitle(),
          description: faker.lorem.sentence(),
        },
      });
      result.push(data);
    }
    return result;
  }
  async createCustomer({ count = 1 }: { count?: number }) {
    if (!this.orgId) throw new Error('orgId is not set');
    let result = [];
    for (let i = 0; i < count; i++) {
      const data = await CustomerService.createCustomer({
        organizationId: this.orgId,
        data: {
          name: faker.person.jobTitle(),
          email: faker.internet.email(),
        },
      });
      result.push(data);
    }
    return result;
  }
  async createroles({
    permissions,
  }: {
    permissions: Record<string, string[]> | {};
  }) {
    if (!this.orgId) throw new Error('orgId is not set');
    const data = await RoleService.create(this.ownerId, this.orgId, {
      name: faker.person.jobTitle(),
      description: faker.lorem.sentence(),
      permissions,
    });
    return data;
  }
  async createMembership({
    userIds,
    roleId,
  }: {
    userIds: string[];
    orgId: string;
    roleId: string;
  }) {
    if (!this.orgId) throw new Error('orgId is not set');
    const tenantDb = getTenantClient(this.orgId);
    let result = [];
    for (const userId of userIds) {
      const data = await tenantDb.membership.create({
        data: {
          userId,
          roleId,
          organizationId: this.orgId,
        },
      });
      result.push(data);
    }
    return result;
  }
  async createEmailProvider({
    providerType = 'RESEND',
  }: {
    providerType?: ProviderType;
  }) {
    if (!this.orgId) throw new Error('orgId is not set');
    const email = faker.internet.email();
    const data = EmailService.createEmailProvider(this.orgId, {
      priority: 1,
      providerType,
      fromEmail: email,
      credentials: {
        apiKey: 'apiKey',
      },
      webhookSecret: 'webhookSecret',
    });
    return data;
  }
  async createTicketAssignemnts({
    assignment,
  }: {
    customerId: string;
    assignment: {
      queueId?: string;
      agentId?: string;
      groupId?: string;
    };
  }) {
    if (!this.orgId) throw new Error('orgId is not set');
    await TicketService.createAndAssign({
      organizationId: this.orgId,
      input: {
        email: faker.internet.email(),
        subject: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        priority: 'HIGH',
        category: 'BUG',
        assignment: {
          queueId: assignment.queueId,
          agentId: assignment.agentId,
          groupId: assignment.groupId,
        },
      },
    });
  }
  async createOnlyTicket({ customerId }: { customerId: string }) {
    if (!this.orgId) throw new Error('orgId is not set');
    await TicketService.createTicket({
      organizationId: this.orgId,
      customerId,
      data: {
        subject: faker.internet.email(),
        description: faker.lorem.sentence(),
        priority: 'HIGH',
        category: 'BUG',
      },
    });
  }
  async assignUserQueue({
    queueId,
    agentIds,
  }: {
    queueId: string;
    agentIds: string[];
  }) {
    if (!this.orgId) throw new Error('orgId is not set');
    await QueueService.addAgents({
      organizationId: this.orgId,
      queueId,
      agentIds,
      userId: this.ownerId,
    });
  }
}
