import dotenv from "dotenv";
import { log } from "@repo/utils";
dotenv.config();

export const env = {
  encryptionKey: process.env.ENCRYPTION_KEY,
  wss: process.env.WSS,
  coreURL: process.env.CORE_URL,
  betterAuthUrl: process.env.BETTER_AUTH_URL,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.BACKEND_PORT || 3000,
};

const required = ["betterAuthSecret", "betterAuthUrl", "encryptionKey"];
for (const key of required) {
  if (!env[key as keyof typeof env]) {
    log.error(`Missing environment variable: ${key}`);
  }
}
