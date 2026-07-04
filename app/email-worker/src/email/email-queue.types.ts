import { JSX } from "react";
import { ProviderType } from "@org/database";
import { CryptoType } from "@org/zod";
export type providerData = {
  credentials: CryptoType;
  providerType: ProviderType;
  fromEmail: string;
};

export type sendEmailService = {
  to: string;
  subject: string;
  jsx: JSX.Element;
  providers: providerData[];
};

export type sendSystemEmailService = Omit<sendEmailService, "organizationId" | "providers">;
