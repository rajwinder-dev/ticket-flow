import { z } from "zod";
import { optionalInput, validDescription, validEmail, validString } from "./helper/zodHelper.js";

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
      description: optionalInput(validDescription),
      logo: optionalInput(z.url()),
      slug: z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must be lowercase, alphanumeric, and can include hyphens",
        ),
      teamSize: z.number().int().positive().optional(),
    })
    .strict(),
};

export const inviteUserOrganizationInput = {
  bodySchema: z
    .object({
      email: validEmail, // Automatically trims and lowercases
      roleId: z.uuid("Invalid Role ID format"), // Keeps UUID validation
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

export const organizationSchemaResponse = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  teamSize: z.number().int().nullable(),
  slug: z.string().nullable(),
  code: z.string(),
  type: z.string().nullable(),
  active: z.boolean(),
  logo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.uuid(),
});
const queueSchema = z.object({
  queueId: z.string().nullable(),
  name: z.string().nullable(),
  ticketCount: z.number(),
});

export const memberSchemaResponse = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  email: z.email().nullable(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  role: z.string().nullable(),
  roleId: z.string().nullable(),
  createdAt: z.coerce.date(),
  organizationId: z.uuid(),
  totalTickets: z.number().optional(),
  queues: z.array(queueSchema).nullable(),
});
export const inviteMemberDetailsResponse = z.object({
  organization: z.string(),
  role: z.string(),
  invitedTo: z.string(),
  invitedBy: z.string(),
  expiresAt: z.date(),
});

export const onboardingStatusSchema = z.object({
  hasRoles: z.boolean(),
  hasGroups: z.boolean(),
  hasQueues: z.boolean(),
  hasInvites: z.boolean(),
  hasEmail: z.boolean(),
  currentStep: z.number().min(0).max(5),
});
// Extract the TypeScript type from the schema
//  --response --
export type CreateOrganizationResponse = z.infer<typeof createOrganizationResponse>;
export type OrganizationSchemaResponse = z.infer<typeof organizationSchemaResponse>;
export type MemberSchemaResponse = z.infer<typeof memberSchemaResponse>;
export type InviteMemberDetailsResponse = z.infer<typeof inviteMemberDetailsResponse>;
export type OnboardingStatusResponse = z.infer<typeof onboardingStatusSchema>;
// --- Inferred Types ---
export type CreateOrganizationInput = z.infer<typeof createOrganizationInput.bodySchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationInput.bodySchema>;
export type InviteUserOrganizationInput = z.infer<typeof inviteUserOrganizationInput.bodySchema>;
