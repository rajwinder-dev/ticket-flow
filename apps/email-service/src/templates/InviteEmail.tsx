import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import * as React from "react";
void React;

export const InviteEmail = ({
  invitedByUsername = "Jane Doe",
  organization = "Marketing",
  inviteLink = "https://example.com/join",
}: any) => (
  <Html>
    <Head />
    <Preview>Join {organization} </Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto my-10 max-w-125 rounded-lg border border-gray-100 bg-white p-10 shadow-sm">
          <Section className="text-center">
            <Text className="text-xl font-semibold">You've been invited!</Text>
          </Section>
          <Text className="text-base leading-7 text-gray-800">
            <strong>{invitedByUsername}</strong> has invited you to join the{" "}
            <strong>{organization}</strong> team on **BrandName**.
          </Text>
          <Section className="mt-6 mb-6 text-center">
            <Button
              className="rounded-md bg-black px-8 py-4 text-center text-sm font-medium text-white no-underline"
              href={inviteLink}
            >
              Join the Team
            </Button>
          </Section>
          <Text className="text-sm text-gray-500">
            Once you join, you'll be able to collaborate with the rest of the team immediately.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default InviteEmail;
