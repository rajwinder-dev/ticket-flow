import z from "zod";

export const createOrganizationInput = {
  bodySchema: z
    .object({
      name: z.string(),
      description: z.string(),
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
export type CreateOrganizationInput = z.infer<typeof createOrganizationInput.bodySchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationInput.bodySchema>
