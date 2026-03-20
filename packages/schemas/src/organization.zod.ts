import z from "zod";

export const createOrganizationInput = {
  bodySchema: z
    .object({
      name: z.string(),
      description: z.string().optional(),
      teamSize: z.number().optional(),
    })
    .strict(),
};
export const updateOrganizationInput = {
  bodySchema: z
    .object({
      description: z.string(),
    })
    .strict(),
};
export const inviteUserOrganizationInput = {
  bodySchema: z
    .object({
      email: z.string(),
      roleId: z.uuid(),
    })
    .strict(),
};
export type CreateOrganizationInput = z.infer<typeof createOrganizationInput.bodySchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationInput.bodySchema>;
export type InviteUserOrganizationInput = z.infer<typeof inviteUserOrganizationInput.bodySchema>;
