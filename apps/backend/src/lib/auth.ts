import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../core/utils/prismaClient.js";
import { EmailService } from "../modules/email/email.service.js";
import ForgotPasswordEmail from "../templates/emails/ForgotPasswordEmail.js";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await EmailService.sendSystemEmail({
        to: user.email,
        subject: "Reset your password",
        jsx: ForgotPasswordEmail({ userName: user.name!, resetLink: url }),
      });
    },
  },
});
