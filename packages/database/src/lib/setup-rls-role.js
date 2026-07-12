import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.js";
const connectionString = process.env.DIRECT_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
async function setup() {
    const DEV_USER = "dev_app_user";
    const DEV_PASS = process.env.DEV_APP_PASSWORD || "dev_password";
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
      GRANT SELECT, INSERT, UPDATE, DELETE
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
        console.log("Dev role setup complete");
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await prisma.$disconnect();
    }
}
setup();
