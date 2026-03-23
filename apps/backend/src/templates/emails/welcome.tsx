import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

void React;
interface WelcomeEmailProps {
  userFirstname: string;
}

export const WelcomeEmail = ({ userFirstname = "there" }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the community! We're glad you're here.</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#5F51E8",
                offwhite: "#fafafa",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite font-sans">
          <Container className="border-lightWhite8 mx-auto my-10 max-w-116.25 rounded border border-solid bg-white p-5">
            <Section className="mt-8">
              <Img
                src="https://your-cdn.com/logo.png"
                width="40"
                height="37"
                alt="Brand Logo"
                className="mx-auto my-0"
              />
            </Section>

            <Text className="mx-0 my-7.5 p-0 text-center text-[24px] font-normal text-black">
              Welcome to <strong>BrandName</strong>
            </Text>

            <Text className="text-[14px] leading-6 text-black">Hello {userFirstname},</Text>

            <Text className="text-[14px] leading-6 text-black">
              We're excited to have you join us! You're now part of a community dedicated to
              building amazing things. To get started, click the button below to verify your account
              and explore your dashboard.
            </Text>

            <Section className="mt-8 mb-8 text-center">
              <Button
                className="bg-brand rounded px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href="https://yourwebsite.com/dashboard"
              >
                Get Started
              </Button>
            </Section>

            <Text className="text-[14px] leading-6 text-black">
              or copy and paste this URL into your browser:{" "}
              <a href="https://yourwebsite.com/dashboard" className="text-blue-600 no-underline">
                https://yourwebsite.com/dashboard
              </a>
            </Text>

            <Hr className="border-lightWhite8 mx-0 my-6.5 w-full border border-solid" />

            <Text className="text-gray6 text-[12px] leading-6">
              If you were not expecting this email, you can safely ignore it.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
