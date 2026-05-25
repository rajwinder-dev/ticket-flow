import "dotenv/config";
import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { providerData } from "./email/email.types";
const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.PORT) || 6379,
  maxRetriesPerRequest: null,
});

// Redis connection logs
connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("ready", () => {
  console.log("Redis ready");
});

connection.on("error", (err: { message?: string }) => {
  console.error("Redis error:", err?.message);
});

// Worker
const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Processing email job: ${job.id}`);

    const   data = job.data as {
      to: string;
      subject: string;
      data: unknown;
      template: string;
      providertype: "SMTP" | "RESEND";
      providers: providerData[];
      isSystem?: boolean;
    };
    console.log(data)
    console.log("Sending email...");
    
    // bsic logic
    // if (isSystem) {
    //   await EmailService.sendSystemEmail({
    //     to,
    //     subject,
    //     jsx: WelcomeEmail({ userFirstName: "test xyz" }),
    //   });
    // } else {
    //   await EmailService.sendEmail({
    //     to,
    //     subject,
    //     jsx: WelcomeEmail({ userFirstName: "test xyz" }),
    //     providers,
    //   });
    // }
      
    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      email: data.to,
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
  console.log("email service is ready");
});

worker.on("active", (job) => {
  console.log(`Job ${job.id} is active`);
});

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed`);
  console.log("Result:", result);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`);
  console.error(err.message);
});

worker.on("stalled", (jobId) => {
  console.warn(`Job ${jobId} stalled`);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

worker.on("closing", () => {
  console.log("Worker is closing");
});

worker.on("closed", () => {
  console.log("Worker closed");
});

// Queue event listeners
const queueEvents = new QueueEvents("EmailQueue", {
  connection,
});

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`Job ${jobId} waiting in queue`);
});

queueEvents.on("completed", ({ jobId }) => {
  console.log(`Queue event: Job ${jobId} completed`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`Queue event: Job ${jobId} failed`);
  console.log(failedReason);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down worker...");

  await worker.close();
  await queueEvents.close();
  await connection.quit();

  process.exit(0);
});
