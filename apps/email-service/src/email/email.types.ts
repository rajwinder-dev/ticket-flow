import { JSX } from "react";
import { ProviderType } from "@repo/database";
import { JsonValue } from "../../../../packages/database/src/generated/internal/prismaNamespace";

export type sendEmailService = {
  to: string;
  subject: string;
  jsx: JSX.Element;
  providers: providerData[];
};

export type providerData = {
  credentials: JsonValue;
  providerType: ProviderType;
  fromEmail: string;
};

export type sendSystemEmailService = Omit<sendEmailService, "organizationId" | "providers">;
