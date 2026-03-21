import {
  Body, Button, Container, Head, Html, Hr, Preview, Section, Text, Tailwind
} from "@react-email/components";
import * as React from "react";

interface ForgotPasswordEmailProps {
  userFirstname: string;
  resetPasswordLink: string;
}

export const ForgotPasswordEmail = ({
  userFirstname = "User",
  resetPasswordLink = "https://example.com/reset-password",
}: ForgotPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your BrandName password</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="bg-white border border-gray-200 rounded my-10 mx-auto p-8 max-w-116.25">
          <Text className="text-2xl font-bold text-center mb-6">Reset Password</Text>
          <Text className="text-gray-700 text-sm leading-6">
            Hi {userFirstname},
          </Text>
          <Text className="text-gray-700 text-sm leading-6">
            Someone recently requested a password reset for your **BrandName** account. If this was you, you can set a new password here:
          </Text>
          <Section className="text-center my-8">
            <Button
              className="bg-[#5F51E8] rounded text-white text-xs font-semibold no-underline text-center px-6 py-3"
              href={resetPasswordLink}
            >
              Reset Password
            </Button>
          </Section>
          <Text className="text-gray-700 text-sm leading-6 italic">
            If you didn't request this, please ignore this email or reply to let us know. This link will expire in 24 hours.
          </Text>
          <Hr className="border-gray-200 my-6" />
          <Text className="text-gray-400 text-xs text-center">
            BrandName, 123 Tech Lane, SF, CA
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ForgotPasswordEmail;
