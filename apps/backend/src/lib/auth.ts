import { betterAuth } from "better-auth";

import { dash } from "@better-auth/infra";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../core/utils/prismaClient.js";
import { EmailService } from "../modules/email/email.service.js";
import ForgotPasswordEmail from "../templates/emails/ForgotPasswordEmail.js";
import { env } from "../config/env.js";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [dash()],
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, token }) => {
      console.log(token);
      const frontendURL = `${env.betterAuthUrl}/reset-password/${token}`;
      await EmailService.sendSystemEmail({
        to: user.email,
        subject: "Reset your password",
        jsx: ForgotPasswordEmail({ userName: user.name!, resetLink: frontendURL }),
      });
    },
    resetPasswordTokenExpiresIn: 3600,
  },
});
