import { betterAuth } from "better-auth";

import { dash } from "@better-auth/infra";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { EmailService } from "../modules/email/email.service.js";
import { env } from "../config/env.js";
import { prisma } from "@repo/database";
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
  baseURL: env.betterAuthUrl,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, token }) => {
      console.log(token);
      const frontendURL = `${env.betterAuthUrl}/reset-password/${token}`;
      await EmailService.queueEmail({
        to: user.email,
        subject: "Reset your password",
        template: "forgetPassword",
        isSystemEmail: true,
        data: {
          userName: user.name!,
          resetLink: frontendURL,
        },
      });
    },
    resetPasswordTokenExpiresIn: 3600,
  },
});
