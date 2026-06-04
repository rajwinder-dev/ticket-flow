import { SmtpSchema } from "@repo/schemas";
import {  NodeMailerService } from "./nodeMailer.provider.js";
import { ResendConfig, ResendService } from "./resend.provider.js";
type ProviderMap = {
  SMTP: {
    config: SmtpSchema;
    service: NodeMailerService;
  }; 
  RESEND: {
    config: ResendConfig;
    service: ResendService;
  };
};
export function emailProviderFactory<T extends keyof ProviderMap>(
  providerType: T,
  credentials: ProviderMap[T]["config"],
) {
  switch (providerType) {
    case "SMTP":
      return new NodeMailerService(credentials as SmtpSchema);
    case "RESEND":
      return new ResendService(credentials as ResendConfig);
    default:
      throw new Error("Unsupported provider");
  }
}
