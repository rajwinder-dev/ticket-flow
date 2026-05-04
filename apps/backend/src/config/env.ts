import dotenv from "dotenv";
import { log } from "../core/helper/log.js";
dotenv.config();

export const env = {
  encryptionKey: process.env.ENCRYPTION_KEY,
  databaseURL: process.env.DATABASE_URL,
  wss: process.env.WSS,
  coreURL: process.env.CORE_URL || "http://localhost:5173",
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
  email: {
    providerType: process.env.SYSTEM_EMAIL_PROVIDER,
    apiKey: process.env.PROVIDER_API_KEY,
    from: process.env.SMTP_EMAIL,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const required = ["encryptionKey", "databaseURL", "accessSecret", "refreshSecret"];
for (const key of required) {
  if (!env[key as keyof typeof env]) {
    log.error(`Missing environment variable: ${key}`);
  }
}
