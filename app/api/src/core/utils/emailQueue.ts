import { Queue } from 'bullmq';
import { EmailQueueInput } from '@org/zod';

const emailQueue = new Queue('email-queue', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    tls: {},
    retryStrategy: (times) => Math.min(times * 200, 2000),
    reconnectOnError: () => true,
    keepAlive: 10000,
  },
});

export async function emailQueuePush(data: EmailQueueInput) {
  try {
    const job = await emailQueue.add(data.jobType, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
    return job.id;
  } catch (error) {
    console.error(`Failed to push job to BullMQ: ${error}`);
    throw error;
  }
}
