import { betterAuth, BetterAuthOptions } from 'better-auth';
import { testUtils } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailQueuePush } from '@org/queues';

export { hashPassword } from 'better-auth/crypto'; // adjust to your auth lib's exported hasher
import { prisma } from '@org/database';
const options = {
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [testUtils()],
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  user: {
    additionalFields: {
      avatar: {
        type: 'string',
      },
    },
  },
  baseURL: process.env.betterAuthUrl,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, token }) => {
      const frontendURL = `${process.env.betterAuthUrl}/reset-password/${token}`;
      await emailQueuePush({
        to: user.email,
        subject: 'Reset your password',
        template: 'forgetPassword',
        jobType: 'email',
        isSystemEmail: true,
        data: {
          userName: user.name!,
          resetLink: frontendURL,
        },
      });
    },
    resetPasswordTokenExpiresIn: 3600,
  },
} satisfies BetterAuthOptions;
export const auth = betterAuth(options);

export type Session = typeof auth.$Infer.Session;
export type User = (typeof auth.$Infer.Session)['user'];
