import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

void React;

export const ForgotPasswordEmail = ({
  userName = "User",
  resetLink = "https://example.com/reset-password",
}: any) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto my-10 max-w-116.25 rounded border border-gray-200 bg-white p-8">
          <Text className="mb-6 text-center text-2xl font-bold">Reset Password</Text>
          <Text className="text-sm leading-6 text-gray-700">Hi {userName},</Text>
          <Text className="text-sm leading-6 text-gray-700">
            Someone recently requested a password reset for your account. If this was you, you can
            set a new password here:
          </Text>
          <Section className="my-8 text-center">
            <Button
              className="rounded bg-[#5F51E8] px-6 py-3 text-center text-xs font-semibold text-white no-underline"
              href={resetLink}
            >
              Reset Password
            </Button>
          </Section>
          <Text className="text-sm leading-6 text-gray-700 italic">
            If you didn't request this, please ignore this email or reply to let us know. This link
            will expire in 24 hours.
          </Text>
          <Hr className="my-6 border-gray-200" />
          <Text className="text-center text-xs text-gray-400">TicketManagement</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ForgotPasswordEmail;
