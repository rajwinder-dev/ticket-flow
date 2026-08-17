import { PrismaClient, PrismaPg } from '@org/database';

const connectionString = process.env.DIRECT_URL;
const adapter = new PrismaPg({
  connectionString,
  max: 10,
});
export const prismSeed: PrismaClient = new PrismaClient({
  adapter,

  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
});
