import { env } from "./env.js";

export const devMode = env.nodeEnv == "development" ? true : false;
