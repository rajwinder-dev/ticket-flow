import { JSX } from "react";

export type sendEmailService = {
  organizationId: string;
  to: string;
  subject: string;
  jsx: JSX.Element;
};
export type sendSystemEmailService = Omit<sendEmailService, "organizationId">;
