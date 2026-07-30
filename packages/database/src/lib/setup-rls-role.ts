import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client.js';

const connectionString = process.env.DIRECT_URL!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function setup() {
  const DEV_USER = 'dev_app_user';
  const DEV_PASS = process.env.DEV_APP_PASSWORD || 'dev_password';

  try {
    console.log(`Setting up role: ${DEV_USER}`);

    // Create role if not exists
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_catalog.pg_roles
          WHERE rolname = '${DEV_USER}'
        ) THEN
          CREATE ROLE ${DEV_USER}
          LOGIN
          PASSWORD '${DEV_PASS}';
        END IF;
      END
      $$;
    `);

    // Schema access
    await prisma.$executeRawUnsafe(`
      GRANT USAGE, CREATE ON SCHEMA public TO ${DEV_USER};
    `);

    // Existing tables
    await prisma.$executeRawUnsafe(`
      GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE
      ON ALL TABLES IN SCHEMA public
      TO ${DEV_USER};
    `);

    // Existing sequences
    await prisma.$executeRawUnsafe(`
      GRANT USAGE, SELECT
      ON ALL SEQUENCES IN SCHEMA public
      TO ${DEV_USER};
    `);

    // Future tables created by current migration user
    await prisma.$executeRawUnsafe(`
      ALTER DEFAULT PRIVILEGES
      IN SCHEMA public
      GRANT SELECT, INSERT, UPDATE, DELETE
      ON TABLES TO ${DEV_USER};
    `);

    // Future sequences
    await prisma.$executeRawUnsafe(`
      ALTER DEFAULT PRIVILEGES
      IN SCHEMA public
      GRANT USAGE, SELECT
      ON SEQUENCES TO ${DEV_USER};
    `);
    // only owns SECURITY DEFINER functions
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_catalog.pg_roles
          WHERE rolname = 'rls_bypass_owner'
        ) THEN
          CREATE ROLE rls_bypass_owner NOLOGIN BYPASSRLS;
        END IF;
      END
      $$;
    `);
    // grant internal usage to rls_bypass_owner
    await prisma.$executeRawUnsafe(`
  GRANT USAGE ON SCHEMA public TO rls_bypass_owner;
`);
    await prisma.$executeRawUnsafe(`
  GRANT SELECT ON "Membership", "Organization", "Role", "EmailProvider" TO rls_bypass_owner;
`);
    // grant get my organizations to rls_bypass_owner
    await prisma.$executeRawUnsafe(`
  ALTER FUNCTION get_my_organizations OWNER TO rls_bypass_owner;
`);
    await prisma.$executeRawUnsafe(`
  GRANT EXECUTE ON FUNCTION get_my_organizations TO ${DEV_USER};
`);
    // grant get email webhook to rls_bypass_owner
    await prisma.$executeRawUnsafe(`
 ALTER FUNCTION get_email_webhook(TEXT[], INT) OWNER TO rls_bypass_owner;
`);
    await prisma.$executeRawUnsafe(` 
REVOKE ALL ON FUNCTION get_email_webhook(TEXT[], INT) FROM PUBLIC;
`);
    await prisma.$executeRawUnsafe(`
  GRANT EXECUTE ON FUNCTION get_email_webhook(TEXT[], INT) TO ${DEV_USER};
`);

    console.log('Dev role setup complete');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

setup();
