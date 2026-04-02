import { z } from "zod";
import { validDescription, validEmail, validString } from "./helper/zodHelper";

export const createOrganizationInput = {
  bodySchema: z
    .object({
      name: validString,
      description: validDescription.optional(),
      type: z.enum(["PERSONAL", "TEAM"]),
      teamSize: z.number().int().positive().optional(),
      slug: z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must be lowercase, alphanumeric, and can include hyphens",
        ),
    })
    .strict(),
};

export const updateOrganizationInput = {
  bodySchema: z
    .object({
      name: validString.optional(),
      description: validDescription.optional(),
      teamSize: z.number().int().positive().optional(),
    })
    .strict(),
};

export const inviteUserOrganizationInput = {
  bodySchema: z
    .object({
      email: validEmail, // Automatically trims and lowercases
      roleId: z.string().uuid("Invalid Role ID format"), // Keeps UUID validation
    })
    .strict(),
};

export const createOrganizationResponse = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().nullable(),
  slug: z.string().nullable(),
});

export const membershipSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  roleId: z.string(),
});
//  --response --
export type CreateOrganizationResponse = z.infer<typeof createOrganizationResponse>
// --- Inferred Types ---
export type CreateOrganizationInput = z.infer<typeof createOrganizationInput.bodySchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationInput.bodySchema>;
export type InviteUserOrganizationInput = z.infer<typeof inviteUserOrganizationInput.bodySchema>;
