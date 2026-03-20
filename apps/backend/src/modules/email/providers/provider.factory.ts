import { ProviderType } from "../../../../generated/prisma";
import { appError } from "../../../core/utils/appError";
import { NodemailerConfig, NodeMailerService } from "./nodeMailer.service";

export function emailProviderFactory(providerType: ProviderType, config: NodemailerConfig) {
  switch (providerType) {
    case "SMTP":
      return new NodeMailerService(config);
    default:
      throw new appError("Unsupported provider", 404, "UNSUPPORTED");
  }
}
