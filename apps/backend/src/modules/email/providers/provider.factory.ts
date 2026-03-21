import { ProviderType } from "../../../../generated/prisma";
import { appError } from "../../../core/utils/appError";
import { NodemailerConfig, NodeMailerService } from "./nodeMailer.service";
import { ResendConfig, ResendService } from "./resend.service";

export function emailProviderFactory(
  providerType: ProviderType,
  credentials: unknown,
) {
  switch (providerType) {
    case "SMTP":
      return new NodeMailerService(credentials as NodemailerConfig);
    case "RESEND":
      return new ResendService(credentials as ResendConfig);
    default:
      throw new appError("Unsupported provider", 404, "UNSUPPORTED");
  }
}
