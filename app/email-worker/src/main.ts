import 'dotenv/config';
import { Worker, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { EmailQueueInput } from '@org/zod';
import { log } from '@org/utils';
import { prisma } from '@org/database';
import { EmailQueueService } from './email/email-queue.service.js';
import { selectTemplate } from './template.map.js';
import { providerData } from './email/email-queue.types.js';

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_TLS ? {} : undefined,
  retryStrategy: (times) => Math.min(times* 200, 2000),
  reconnectOnError: () => true,
  keepAlive: 10000,
  enableReadyCheck: true,
});

// Redis connection logs
connection.on('connect', () => {
  log.success('Redis connected');
});

connection.on('error', (err: { message: string }) => {
  log.error(err?.message);
});

// Worker
const worker = new Worker(
  'email-queue',
  async (job) => {
    log.info(`Processing email job: ${job.id}`);
    const { isSystemEmail, to, subject, organizationId, data, template } =
      job.data as EmailQueueInput;

    const jsx = selectTemplate(template, data);

    if (isSystemEmail) {
      await EmailQueueService.sendSystemEmail({
        to,
        subject,
        jsx,
      });
    } else {
      const providers = (await prisma.emailProvider.findMany({
        where: { organizationId },
        select: {
          providerType: true,
          credentials: true,
          fromEmail: true,
        },
      })) as providerData[];
      if (!providers.length) throw new Error('No email providers found');

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
    connection: connection as any,

    limiter: {
      max: 100,
      duration: 1000,
    },

    concurrency: 5,
  },
);

// Worker lifecycle logs
worker.on('ready', () => {
  log.success('email service is ready');
});

worker.on('active', (job) => {
  log.success(`Job ${job.id} is active`);
});

worker.on('completed', (job) => {
  log.success(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  log.error(`Job ${job?.id} failed`);
  log.error(err.message);
});

worker.on('stalled', (jobId) => {
  console.warn(`Job ${jobId} stalled`);
});

worker.on('error', (err) => {
  log.error(err.message);
});

worker.on('closing', () => {
  log.info('Worker is closing');
});

worker.on('closed', () => {
  log.info('Worker closed');
});

const queueEvents = new QueueEvents('EmailQueue', {
  connection: connection as any,
});

queueEvents.on('waiting', ({ jobId }) => {
  log.info(`Job ${jobId} waiting in queue`);
});

queueEvents.on('completed', ({ jobId }) => {
  log.info(`Queue event: Job ${jobId} completed`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  log.info(`Queue event: Job ${jobId} failed`);
  log.info(failedReason);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  log.info('Shutting down worker...');

  await worker.close();
  await queueEvents.close();
  await connection.quit();

  process.exit(0);
});
