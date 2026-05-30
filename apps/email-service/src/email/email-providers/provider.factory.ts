import { NodemailerConfig, NodeMailerService } from "./nodeMailer.service.js";
import { ResendConfig, ResendService } from "./resend.service.js";

export function emailProviderFactory(
  providerType: "RESEND" | "SMTP" | "MAILTRAP",
  credentials: unknown,
) {
  switch (providerType) {
    case "SMTP":
      return new NodeMailerService(credentials as NodemailerConfig);
    case "RESEND":
      return new ResendService(credentials as ResendConfig);
    default:
      throw new Error("Unsupported provider");
  }
}
