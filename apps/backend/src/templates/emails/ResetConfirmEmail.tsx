import {
  Body, Container, Head, Html, Preview, Text, Tailwind, Link
} from "@react-email/components";
import * as React from "react";

export const ResetConfirmationEmail = () => (
  <Html>
    <Head />
    <Preview>Your password has been changed</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="my-10 mx-auto p-5 max-w-116.25 border border-solid border-gray-200 rounded">
          <Text className="text-green-600 text-xl font-bold">Success!</Text>
          <Text className="text-black text-sm leading-6">
            Your password for **BrandName** was successfully changed.
          </Text>
          <Text className="text-black text-sm leading-6">
            If you did not make this change, please <Link href="#" className="text-blue-600 underline">contact our security team</Link> immediately to secure your account.
          </Text>
          <Text className="text-gray-500 text-sm mt-8">
            For your security, you have been logged out of all other devices.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ResetConfirmationEmail;
