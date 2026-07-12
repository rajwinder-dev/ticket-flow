import { createAuthClient } from "better-auth/react";

import { dashClient } from "@better-auth/infra/client";
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  plugins: [dashClient()],
});
