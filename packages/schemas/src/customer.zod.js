import z from "zod";
import { optionalInput, validEmail, validPhoneNo, validString, validUrl } from "./helper/zodHelper.js";
export const createCustomerInput = {
    bodySchema: z.object({
        email: validEmail,
        name: validString,
        phone: optionalInput(validPhoneNo),
        avatarUrl: optionalInput(validUrl),
    }),
};
export const updateCustomerInput = {
    bodySchema: z.object({
        name: validString,
        phone: optionalInput(validPhoneNo).nullable(),
        avatarUrl: optionalInput(validUrl).nullable(),
    }),
};
export const customerSchemaResponse = z.object({
    id: z.uuid(),
    name: z.string().nullable(),
    email: z.email(),
    phone: z.string().nullable(),
    avatarUrl: z.url().nullable(),
    totalTickets: z.number().int().nonnegative(),
    openTickets: z.number().int().nonnegative(),
});
//# sourceMappingURL=customer.zod.js.map