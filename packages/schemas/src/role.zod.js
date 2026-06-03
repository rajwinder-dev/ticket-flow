import { z } from "zod";
import { optionalInput, validDescription, validString } from "./helper/zodHelper.js";
// Permissions pattern: { "resource": ["action1", "action2"] }
// Example: { "users": ["create", "read"], "billing": ["view"] }
export const createRoleInput = {
    bodySchema: z
        .object({
        name: validString,
        description: optionalInput(validDescription).nullable(),
        permissions: z.record(z.string(), z.array(z.string())),
    })
        .strict(),
};
export const updateRoleInput = {
    bodySchema: z
        .object({
        name: validString.optional(),
        description: optionalInput(validDescription).nullable(),
        permissions: z.record(z.string(), z.array(z.string())),
    })
        .strict(),
};
export const roleSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    permissions: z.record(z.string(), z.array(z.string())),
});
//# sourceMappingURL=role.zod.js.map