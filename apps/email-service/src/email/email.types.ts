import { JSX } from "react";
import { EncryptionType } from "../crypto";

export type sendEmailService = {
  to: string;
  subject: string;
  jsx: JSX.Element;
  providers: providerData[];
};

export type providerData = {
  credentials: EncryptionType;
  providerType: "SMTP" | "RESEND";
  fromEmail: string;
};

export type sendSystemEmailService = Omit<sendEmailService, "organizationId" | "providers">;
