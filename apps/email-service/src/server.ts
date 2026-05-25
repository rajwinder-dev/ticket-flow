import "dotenv/config";
import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { EmailQueueInput } from "@repo/schemas";
import { log } from "@repo/utils";
import { prisma } from "@repo/database";
import { EmailService } from "./email/email.service";
import { selectTemplate } from "./template.map";
const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.PORT) || 6379,
  maxRetriesPerRequest: null,
});

// Redis connection logs
connection.on("connect", () => {
  log.success("Redis connected");
});

connection.on("ready", () => {
  log.success("Redis ready");
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
      await EmailService.sendSystemEmail({
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
      });

      await EmailService.sendEmail({
        to,
        subject,
        jsx,
        providers,
      });
    }

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      email: to,
    };
  },
  {
    connection,

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
  connection,
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
