import { ActorType, LogSeverity, EntryType } from '@org/database';
import { log } from '@org/utils';
import { getTenantClient, prisma } from '@org/database'; // adjust to wherever your tenant client factory actually lives

/**
 * Seeds the ActivityLog table for every organization, using each
 * organization's own tenant-scoped DB client. Covers every ActorType,
 * LogSeverity, and EntryType combination you're likely to hit in production.
 */
export async function seedActivityLog() {
  log.info('seeding activity log');

  const organizations = await prisma.organization.findMany();

  if (organizations.length === 0) {
    log.info('no organizations found, nothing to seed');
    return;
  }

  for (const organization of organizations) {
    const orgId = organization.id;
    await seedActivityLogForOrg(orgId);
  }

  log.info(`seeded activity log for ${organizations.length} organizations`);
}

async function seedActivityLogForOrg(orgId: string) {
  const tenantDb = getTenantClient(orgId);

  // Grab a couple of users within this tenant's DB to attach logs to.
  // Falls back to creating minimal placeholder records if none exist,
  // so this script is safe to run against a fresh tenant DB.
  let users = await tenantDb.user.findMany({ take: 3 });
  if (users.length === 0) {
    users = await Promise.all(
      ['Alice Johnson', 'Bob Smith', 'Carol Diaz'].map((name, i) =>
        tenantDb.user.create({
          data: {
            name,
            email: `seed-user-${i}-${orgId}@example.com`,
          } as any, // adjust fields to match your User model
        }),
      ),
    );
  }

  const [alice, bob, carol] = users;

  // Build a batch of representative log entries for this tenant.
  const entries: Parameters<typeof tenantDb.activityLog.create>[0]['data'][] = [
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

  // 3. Insert them.
  await tenantDb.activityLog.createMany({
    data: entries,
    skipDuplicates: true,
  });

  log.info(`seeded ${entries.length} activity log entries`);
}
