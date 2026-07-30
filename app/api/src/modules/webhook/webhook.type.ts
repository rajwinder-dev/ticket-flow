import { EncryptionType } from '@org/utils';

export interface EmailWebhookRow {
  id: string;
  organizationId: string;
  providerType: string;
  fromEmail: string;
  domain: string;
  webhookSecret: string;
  credentials: EncryptionType;
  priority: number;
}
