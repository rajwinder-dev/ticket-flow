import { createAuthClient } from "better-auth/react";

import { dashClient } from "@better-auth/infra/client";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [dashClient()],
});
