import z from "zod";
export declare const createCustomerInput: {
    bodySchema: z.ZodObject<{
        email: z.ZodEmail;
        name: z.ZodString;
        phone: z.ZodPreprocess<z.ZodOptional<z.ZodString>>;
        avatarUrl: z.ZodPreprocess<z.ZodOptional<z.ZodURL>>;
    }, z.z.core.$strip>;
};
export declare const updateCustomerInput: {
    bodySchema: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodNullable<z.ZodPreprocess<z.ZodOptional<z.ZodString>>>;
        avatarUrl: z.ZodNullable<z.ZodPreprocess<z.ZodOptional<z.ZodURL>>>;
    }, z.z.core.$strip>;
};
export declare const customerSchemaResponse: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodNullable<z.ZodString>;
    email: z.ZodEmail;
    phone: z.ZodNullable<z.ZodString>;
    avatarUrl: z.ZodNullable<z.ZodURL>;
    totalTickets: z.ZodNumber;
    openTickets: z.ZodNumber;
}, z.z.core.$strip>;
export type CustomerSchemaResponse = z.infer<typeof customerSchemaResponse>;
export type CreateCustomerInput = z.infer<typeof createCustomerInput.bodySchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerInput.bodySchema>;
//# sourceMappingURL=customer.zod.d.ts.map