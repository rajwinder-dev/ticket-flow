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
  Hr,
} from "@react-email/components";
import * as React from "react";
void React;

export const NewMemberNotificationEmail = ({
  ownerName = "Admin",
  newMemberName = "John Smith",
  newMemberEmail = "john@example.com",
  organizationName = "Marketing",
  manageMembersUrl = "https://example.com/dashboard/members",
}: any) => (
  <Html>
    <Head />
    <Preview>
      {newMemberName} just joined {organizationName}
    </Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto my-10 max-w-[500px] rounded-lg border border-gray-100 bg-white p-10 shadow-sm">
          <Section>
            <Text className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              New Team Member
            </Text>
            <Text className="mt-2 text-2xl font-bold text-gray-900">Your team is growing!</Text>
          </Section>

          <Text className="mt-6 text-base leading-7 text-gray-700">Hi {ownerName},</Text>
          <Text className="text-base leading-7 text-gray-700">
            Great news! <strong>{newMemberName}</strong> (<em>{newMemberEmail}</em>) has accepted
            your invitation and is now a member of the <strong>{organizationName}</strong> team.
          </Text>

          <Section className="mt-8 mb-8">
            <Button
              className="rounded-md bg-black px-10 py-4 text-center text-sm font-semibold text-white no-underline"
              href={manageMembersUrl}
            >
              Manage Team Members
            </Button>
          </Section>

          <Hr className="my-6 border-gray-200" />

          <Text className="text-xs text-gray-400">
            You received this because you are an owner of the {organizationName} organization on
            **BrandName**.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default NewMemberNotificationEmail;
