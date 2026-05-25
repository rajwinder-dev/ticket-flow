import { appError } from "../../../core/utils/appError.js";
import { ProviderType } from "@repo/database";
import { NodemailerConfig, NodeMailerService } from "./nodeMailer.service.js";
import { ResendConfig, ResendService } from "./resend.service.js";

export function emailProviderFactory(providerType: ProviderType, credentials: unknown) {
  switch (providerType) {
    case "SMTP":
      return new NodeMailerService(credentials as NodemailerConfig);
    case "RESEND":
      return new ResendService(credentials as ResendConfig);
    default:
      throw new appError("Unsupported provider", 404, "UNSUPPORTED");
  }
}
