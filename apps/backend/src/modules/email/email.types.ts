import { JSX } from "react";

export type sendEmailService = {
  organizationId: string;
  to: string;
  from: string;
  subject: string;
  jsx: JSX.Element;
};
