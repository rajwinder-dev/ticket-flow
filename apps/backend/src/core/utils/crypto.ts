import { CryptoUtils } from "@repo/utils";
import { env } from "../../config/env.js";

export const crypto = new CryptoUtils(env.encryptionKey!);
