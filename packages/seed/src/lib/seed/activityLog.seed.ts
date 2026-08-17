import { ActorType, LogSeverity, EntryType } from '@org/database';
import { log } from '@org/utils';
import { prisma } from '@org/database'; // adjust to wherever your tenant client factory actually lives
import { prismSeed } from '../prismaSeedClient.js';
import { progress } from '../seed.helper.js';

export async function seedActivityLog(maxLogsPerOrg: number = 20) {
  if (maxLogsPerOrg <= 0) {
    log.info('maxLogsPerOrg is 0 or negative, nothing to seed');
    return;
  }

  log.info(`seeding activity log (max ${maxLogsPerOrg} per org)`);

  const organizations = await prisma.organization.findMany();

  if (organizations.length === 0) {
    log.info('no organizations found, nothing to seed');
    return;
  }

  for (const [current, organization] of organizations.entries()) {
    const orgId = organization.id;
    await seedActivityLogForOrg(orgId, maxLogsPerOrg);
    progress(organizations.length, current);
  }
}

async function seedActivityLogForOrg(orgId: string, maxLogsPerOrg: number) {
  let users = await prismSeed.user.findMany({ take: 3 });
  if (users.length === 0) {
    users = await Promise.all(
      ['Alice Johnson', 'Bob Smith', 'Carol Diaz'].map((name, i) =>
        prismSeed.user.create({
          data: {
            name,
            email: `seed-user-${i}-${orgId}@example.com`,
          } as any, // adjust fields to match your User model
        }),
      ),
    );
  }

  const [alice, bob, carol] = users;

  type LogEntry = Parameters<typeof prismSeed.activityLog.create>[0]['data'];

  const templates: LogEntry[] = [
    {
      actorId: alice.id,
      actorType: ActorType.USER,
      event: 'ticket.status_updated',
      severity: LogSeverity.INFO,
      entityType: EntryType.TICKET,
      entityId: crypto.randomUUID(),
      changes: { status: { from: 'OPEN', to: 'CLOSED' } },
      message: 'Ticket closed by agent',
      metadata: { source_platform: 'web' },
      ipAddress: '203.0.113.10',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      organizationId: orgId,
    },
    {
      actorId: bob.id,
      actorType: ActorType.USER,
      event: 'ticket.priority_changed',
      severity: LogSeverity.WARN,
      entityType: EntryType.TICKET,
      entityId: crypto.randomUUID(),
      changes: { priority: { from: 'LOW', to: 'HIGH' } },
      message: 'Priority escalated after SLA breach warning',
      metadata: { reason: 'sla_risk' },
      ipAddress: '198.51.100.22',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      organizationId: orgId,
    },
    {
      actorId: null,
      actorType: ActorType.SYSTEM,
      event: 'auth.token_expired',
      severity: LogSeverity.DEBUG,
      entityType: EntryType.AUTH,
      entityId: crypto.randomUUID(),
      changes: {},
      message: 'Session token expired and was revoked',
      metadata: { source_platform: 'cron' },
      ipAddress: null,
      userAgent: null,
      organizationId: orgId,
    },
    {
      actorId: null,
      actorType: ActorType.API_KEY,
      event: 'user.created',
      severity: LogSeverity.INFO,
      entityType: EntryType.USER,
      entityId: carol.id,
      changes: { email: { from: null, to: carol.email } },
      message: 'User provisioned via public API',
      metadata: { api_key_label: 'integration-prod' },
      ipAddress: '192.0.2.5',
      userAgent: null,
      organizationId: orgId,
    },
    {
      actorId: null,
      actorType: ActorType.SUPPORT_AGENT,
      event: 'role.permissions_updated',
      severity: LogSeverity.WARN,
      entityType: EntryType.ROLE,
      entityId: crypto.randomUUID(),
      changes: {
        permissions: { from: ['read'], to: ['read', 'write', 'admin'] },
      },
      message: 'Elevated permissions granted at customer request',
      metadata: { reason: 'customer_escalation' },
      ipAddress: '203.0.113.45',
      userAgent: 'internal-support-console/2.4.0',
      organizationId: orgId,
    },
    {
      actorId: alice.id,
      actorType: ActorType.USER,
      event: 'organization.settings_updated',
      severity: LogSeverity.ERROR,
      entityType: EntryType.ORGANIZATION,
      entityId: orgId,
      changes: {
        billingEmail: { from: 'old@acme.com', to: 'billing@acme.com' },
      },
      message: 'Failed to sync updated billing email to payment provider',
      metadata: { error_code: 'PAYMENT_SYNC_FAILED' },
      ipAddress: '203.0.113.10',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      organizationId: orgId,
    },
  ];

  const entries: LogEntry[] = Array.from({ length: maxLogsPerOrg }, (_, i) => {
    const template = templates[i % templates.length];
    const pass = Math.floor(i / templates.length);

    return pass === 0
      ? template
      : { ...template, entityId: crypto.randomUUID() };
  });

  await prismSeed.activityLog.createMany({
    data: entries,
    skipDuplicates: true,
  });

}
