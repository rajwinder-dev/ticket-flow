import { JSX } from "react";
import { ProviderType } from "@repo/database";
import { CryptoType } from "@repo/schemas";

export type sendEmailService = {
  to: string;
  subject: string;
  jsx: JSX.Element;
  providers: providerData[];
};

export type providerData = {
  credentials: CryptoType;
  providerType: ProviderType;
  fromEmail: string;
};

export type sendSystemEmailService = Omit<sendEmailService, "organizationId" | "providers">;
