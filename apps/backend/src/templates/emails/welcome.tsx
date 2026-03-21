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
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userFirstname: string;
}

export const WelcomeEmail = ({
  userFirstname = "there",
}: WelcomeEmailProps) => {
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
          <Container className="bg-white border border-solid border-lightWhite8 rounded my-10 mx-auto p-5 max-w-116.25">
            <Section className="mt-8">
              <Img
                src="https://your-cdn.com/logo.png"
                width="40"
                height="37"
                alt="Brand Logo"
                className="my-0 mx-auto"
              />
            </Section>

            <Text className="text-black text-[24px] font-normal text-center p-0 my-7.5 mx-0">
              Welcome to <strong>BrandName</strong>
            </Text>

            <Text className="text-black text-[14px] leading-6">
              Hello {userFirstname},
            </Text>

            <Text className="text-black text-[14px] leading-6">
              We're excited to have you join us! You're now part of a community
              dedicated to building amazing things. To get started, click the
              button below to verify your account and explore your dashboard.
            </Text>

            <Section className="text-center mt-8 mb-8">
              <Button
                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href="https://yourwebsite.com/dashboard"
              >
                Get Started
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-6">
              or copy and paste this URL into your browser:{" "}
              <a href="https://yourwebsite.com/dashboard" className="text-blue-600 no-underline">
                https://yourwebsite.com/dashboard
              </a>
            </Text>

            <Hr className="border border-solid border-lightWhite8 my-6.5 mx-0 w-full" />

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
