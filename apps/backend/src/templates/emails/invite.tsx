import {
  Body, Button, Container, Head, Html,  Preview, Section, Text, Tailwind
} from "@react-email/components";
import * as React from "react";

interface InviteEmailProps {
  invitedByUsername: string;
  teamName: string;
  inviteLink: string;
}

export const InviteEmail = ({
  invitedByUsername = "Jane Doe",
  teamName = "Marketing",
  inviteLink = "https://example.com/join",
}: InviteEmailProps) => (
  <Html>
    <Head />
    <Preview>Join {teamName} on BrandName</Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="bg-white border border-gray-100 rounded-lg my-10 mx-auto p-10 max-w-125 shadow-sm">
          <Section className="text-center">
             <Text className="text-xl font-semibold">You've been invited!</Text>
          </Section>
          <Text className="text-gray-800 text-base leading-7">
            <strong>{invitedByUsername}</strong> has invited you to join the <strong>{teamName}</strong> team on **BrandName**.
          </Text>
          <Section className="text-center mt-6 mb-6">
            <Button
              className="bg-black rounded-md text-white text-sm font-medium no-underline text-center px-8 py-4"
              href={inviteLink}
            >
              Join the Team
            </Button>
          </Section>
          <Text className="text-gray-500 text-sm">
            Once you join, you'll be able to collaborate with the rest of the team immediately.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default InviteEmail;
