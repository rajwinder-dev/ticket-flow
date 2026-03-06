import dotenv from "dotenv";
import { log } from "../core/helper/log";
dotenv.config();

export const env = {
  encryptionKey: process.env.ENCRYPTION_KEY,
  databaseURL: process.env.DATABASE_URL,
  wss: process.env.WSS,
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
};

const required = [
  "encryptionKey",
  "databaseURL",
  "accessSecret",
  "refreshSecret",
];


for (const key of required) {
  if (!env[key as keyof typeof env]) {
    log.error(`Missing environment variable: ${key}`);
  }
}


