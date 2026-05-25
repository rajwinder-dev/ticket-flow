import { Queue } from "bullmq";
import { EmailQueueInput } from "@repo/schemas";

const emailQueue = new Queue("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export async function emailQueuePush(data: EmailQueueInput) {
  try {
    const job = await emailQueue.add(data.jobType, data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    });

    return job.id;
  } catch (error) {
    console.error(`Failed to push job to BullMQ: ${error}`);
    throw error;
  }
}
