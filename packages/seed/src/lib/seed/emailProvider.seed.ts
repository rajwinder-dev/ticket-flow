import { prisma } from '@org/database';
import { CryptoUtils, log } from '@org/utils';
import { prismSeed } from '../prismaSeedClient.js';
import { progress } from '../seed.helper.js';

export async function seedEmailProviders() {
  log.info('seeding email providers');

  const {
    RESEND_API_KEY,
    RESEND_WEBHOOK_SECRET,
    RESEND_DOMAIN,
    ENCRYPTION_KEY,
  } = process.env;

  if (
    !ENCRYPTION_KEY ||
    !RESEND_API_KEY ||
    !RESEND_WEBHOOK_SECRET ||
    !RESEND_DOMAIN
  ) {
    log.warn(
      'seedEmailProviders: skipping — missing one or more required env vars ' +
        '(ENCRYPTION_KEY, RESEND_API_KEY, RESEND_WEBHOOK_SECRET, RESEND_DOMAIN)',
    );
    return;
  }

  const crypto = new CryptoUtils(ENCRYPTION_KEY);

  const seedApi = {
    credentials: {
      apiKey: RESEND_API_KEY,
    },
    webhookSecret: RESEND_WEBHOOK_SECRET,
    domain: RESEND_DOMAIN,
  };

  const encryptedCredentials = crypto.encrypt(
    JSON.stringify(seedApi.credentials),
  );

  // Dedupe: one email provider per organization, not per membership
  const organizations = await prisma.organization.findMany();

  for (const [current, org] of organizations.entries()) {
    const orgName = org?.name;
    if (!orgName) {
      log.warn(`skipping org ${org.id} — missing organization name`);
      continue;
    }

    const fromEmail = `${orgName.split(' ').join('_')}@${seedApi.domain}`;

    await prismSeed.emailProvider.create({
      data: {
        organizationId: org.id,
        providerType: 'RESEND',
        fromEmail,
        domain: seedApi.domain,
        webhookSecret: seedApi.webhookSecret,
        credentials: encryptedCredentials,
        priority: 1,
      },
    });
    progress(organizations.length, current);
  }

  log.success('email providers seeded successfully');
}
