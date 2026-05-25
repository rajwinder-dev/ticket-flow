import { Queue } from "bullmq";

const emailQueue = new Queue("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export async function disptachEmail(data: {
  jobType: "email";
  to: string;
  subject: string;
  data: unknown;
  template: string;
  organizationId: string;
}) {
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
