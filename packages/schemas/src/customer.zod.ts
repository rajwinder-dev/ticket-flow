import z from "zod";

export const crateCustomerInput = {
  bodySchema: z.object({
    email: z.email(),
    name: z.string(),
  }),
};
export const updateCustomerInput = {
  bodySchema: z.object({
    name: z.string(),
  }),
};
export type CreateCustomerInput = z.infer<typeof crateCustomerInput.bodySchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerInput.bodySchema>;
