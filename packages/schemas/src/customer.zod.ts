import z from "zod";
import { validEmail, validString } from "./helper/zodHelper";

export const crateCustomerInput = {
  bodySchema: z.object({
    email: validEmail,
    name: validString,
  }),
};
export const updateCustomerInput = {
  bodySchema: z.object({
    name: validString,
  }),
};
export type CreateCustomerInput = z.infer<typeof crateCustomerInput.bodySchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerInput.bodySchema>;
