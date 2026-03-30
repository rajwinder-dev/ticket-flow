import { z } from "zod";
import { validDescription, validPermissions, validString } from "./helper/zodHelper";

// Permissions pattern: { "resource": ["action1", "action2"] }
// Example: { "users": ["create", "read"], "billing": ["view"] }


export const createRoleInput = {
  bodySchema: z
    .object({
      name: validString,
      description: validDescription.optional(),
      permissions: validPermissions,
    })
    .strict(),
};

export const updateRoleInput = {
  bodySchema: z
    .object({
      // Allowed name updates as well, just in case of typos
      name: validString.optional(),
      description: validDescription.optional(),
      permissions: validPermissions.optional(),
    })
    .strict(),
};

// --- Inferred Types ---
// Fixed casing: types should usually be PascalCase
export type CreateRoleInput = z.infer<typeof createRoleInput.bodySchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleInput.bodySchema>;
