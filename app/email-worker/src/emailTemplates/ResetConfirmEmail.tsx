import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

void React;

export const ResetConfirmationEmail = () => (
  <Html>
    <Head />
    <Preview>Your password has been changed</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto my-10 max-w-116.25 rounded border border-solid border-gray-200 p-5">
          <Text className="text-xl font-bold text-green-600">Success!</Text>
          <Text className="text-sm leading-6 text-black">
            Your password for **BrandName** was successfully changed.
          </Text>
          <Text className="text-sm leading-6 text-black">
            If you did not make this change, please{" "}
            <Link href="#" className="text-blue-600 underline">
              contact our security team
            </Link>{" "}
            immediately to secure your account.
          </Text>
          <Text className="mt-8 text-sm text-gray-500">
            For your security, you have been logged out of all other devices.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ResetConfirmationEmail;
