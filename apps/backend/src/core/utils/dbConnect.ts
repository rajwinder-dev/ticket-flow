import { log } from "../helper/log.js";
import { prisma } from "./prismaClient.js";

export async function connectUntilSuccess(
  delayMs = 5000,
  maxRetries = 5,
): Promise<boolean> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;

      log.success("Database connected");
      return true;
    } catch {
      attempts++;

      log.error(`Database connection failed (${attempts}/${maxRetries})`);

      if (attempts >= maxRetries) {
        throw new Error("Database connection failed after maximum retries");
      }

      log.info(`Retrying in ${delayMs / 1000}s...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  return false;
}
