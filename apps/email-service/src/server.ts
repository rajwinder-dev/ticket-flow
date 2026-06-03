import "dotenv/config";
import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { EmailQueueInput } from "@repo/schemas";
import { log } from "@repo/utils";
import { prisma } from "@repo/database";
import { EmailQueueService } from "./email/email-queue.service";
import { selectTemplate } from "./template.map";
import { providerData } from "./email/email-queue.types";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  maxRetriesPerRequest: null,
});

// Redis connection logs
connection.on("connect", () => {
  log.success("Redis connected");
});

connection.on("error", (err: { message: string }) => {
  log.error(err?.message);
});

// Worker
const worker = new Worker(
  "email-queue",
  async (job) => {
    log.info(`Processing email job: ${job.id}`);
    const { isSystemEmail, to, subject, organizationId, data } = job.data as EmailQueueInput;
    const jsx = selectTemplate("welcome", data);

    if (isSystemEmail) {
      await EmailQueueService.sendSystemEmail({
        to,
        subject,
        jsx,
      });
    } else {
      const providers = await prisma.emailProvider.findMany({
        where: { organizationId },
        select: {
          providerType: true,
          credentials: true,
          fromEmail: true,
        },
      }) as providerData[];
      if (!providers.length) throw new Error("No email providers found");
    
      await EmailQueueService.sendEmail({
        to,
        subject,
        jsx,
        providers,
      });
    }

    // Simulate email sending
    return {
      success: true,
      email: to,
    };
  },
  {
    // FIX: Forced Type Cast to bypass the 5.11.0 vs 5.10.1 type mismatch
    connection: connection as any,

    limiter: {
      max: 100,
      duration: 1000,
    },

    concurrency: 5,
  },
);

// Worker lifecycle logs
worker.on("ready", () => {
  log.success("email service is ready");
});

worker.on("active", (job) => {
  log.success(`Job ${job.id} is active`);
});

worker.on("completed", (job) => {
  log.success(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  log.error(`Job ${job?.id} failed`);
  log.error(err.message);
});

worker.on("stalled", (jobId) => {
  console.warn(`Job ${jobId} stalled`);
});

worker.on("error", (err) => {
  log.error(err.message);
});

worker.on("closing", () => {
  log.info("Worker is closing");
});

worker.on("closed", () => {
  log.info("Worker closed");
});

// Queue event listeners
const queueEvents = new QueueEvents("EmailQueue", {
  // FIX: Forced Type Cast here as well to prevent the compiler from failing downstream
  connection: connection as any,
});

queueEvents.on("waiting", ({ jobId }) => {
  log.info(`Job ${jobId} waiting in queue`);
});

queueEvents.on("completed", ({ jobId }) => {
  log.info(`Queue event: Job ${jobId} completed`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  log.info(`Queue event: Job ${jobId} failed`);
  log.info(failedReason);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  log.info("Shutting down worker...");

  await worker.close();
  await queueEvents.close();
  await connection.quit();

  process.exit(0);
});
