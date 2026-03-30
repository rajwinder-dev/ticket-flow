import { z } from "zod";
import {
  validString,
  validDescription,
  validEmail
} from "./helper/zodHelper";

export const createOrganizationInput = {
  bodySchema: z
    .object({
      name: validString, 
      description: validDescription.optional(),
      teamSize: z.number().int().positive().optional(),
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

// --- Inferred Types ---
export type CreateOrganizationInput = z.infer<typeof createOrganizationInput.bodySchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationInput.bodySchema>;
export type InviteUserOrganizationInput = z.infer<typeof inviteUserOrganizationInput.bodySchema>;
