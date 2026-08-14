import { betterAuth, BetterAuthOptions } from 'better-auth';
import { testUtils } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
// import { EmailService } from "../modules/email/email.service.js";
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
      console.log('frontendURL', frontendURL);
      // await EmailService.queueEmail({
      //   to: user.email,
      //   subject: "Reset your password",
      //   template: "forgetPassword",
      //   isSystemEmail: true,
      //   data: {
      //     userName: user.name!,
      //     resetLink: frontendURL,
      //   },
      // });
    },
    resetPasswordTokenExpiresIn: 3600,
  },
} satisfies BetterAuthOptions;
export const auth = betterAuth(options);

export type Session = typeof auth.$Infer.Session;
export type User = (typeof auth.$Infer.Session)['user'];
