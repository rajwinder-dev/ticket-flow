export type sendEmailService = {
  organizationId: string;
  to: string;
  subject: string;
  template: string;
  data: unknown;
};
export type sendSystemEmailService = Omit<sendEmailService, "organizationId">;
