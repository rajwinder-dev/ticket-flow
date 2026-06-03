import { z } from "zod";
export declare const createRoleInput: {
    bodySchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodNullable<z.ZodPreprocess<z.ZodOptional<z.ZodString>>>;
        permissions: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const updateRoleInput: {
    bodySchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodNullable<z.ZodPreprocess<z.ZodOptional<z.ZodString>>>;
        permissions: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const roleSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    permissions: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type RoleSchema = z.infer<typeof roleSchema>;
export type CreateRoleInput = z.infer<typeof createRoleInput.bodySchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleInput.bodySchema>;
//# sourceMappingURL=role.zod.d.ts.map