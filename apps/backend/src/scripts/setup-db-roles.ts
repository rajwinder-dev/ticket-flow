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
    console.log(`🚀 Setting up restricted role: ${DEV_USER}...`);

    // 1. Create the role
    await prisma.$executeRawUnsafe(`CREATE ROLE ${DEV_USER} WITH LOGIN PASSWORD '${DEV_PASS}';`);

    // 2. Grant basic schema access
    await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO ${DEV_USER};`);
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO ${DEV_USER};`);

    // 3. Grant DML permissions on EXISTING tables
    await prisma.$executeRawUnsafe(`
      GRANT SELECT, INSERT, UPDATE, DELETE 
      ON ALL TABLES IN SCHEMA public 
      TO ${DEV_USER};
    `);

    // 4. Grant permissions on SEQUENCES (Required for ID auto-incrementing)
    await prisma.$executeRawUnsafe(`
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${DEV_USER};
    `);

    // 5. Future-proof: Grant permissions on NEW tables
    await prisma.$executeRawUnsafe(`
      ALTER DEFAULT PRIVILEGES IN SCHEMA public 
      GRANT SELECT, INSERT, UPDATE, DELETE 
      ON TABLES TO ${DEV_USER};
    `);

    await prisma.$executeRawUnsafe(`
      ALTER DEFAULT PRIVILEGES IN SCHEMA public 
      GRANT USAGE, SELECT ON SEQUENCES TO ${DEV_USER};
    `);

    console.log("✅ Roles and permissions created successfully");
  } catch (e: any) {
    if (e.code === "P2010" || e.message.includes("already exists")) {
      console.log("⚠️ Role already exists, skipping creation...");
    } else {
      console.error("❌ Error setting up roles:", e);
    }
  } finally {
    await prisma.$disconnect();
  }
}

setup();
