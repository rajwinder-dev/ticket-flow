import z from "zod";
export declare const lookupInputGroupId: {
    paramsSchema: z.ZodObject<{
        groupId: z.ZodUUID;
    }, z.z.core.$strip>;
};
export declare const lookupInputQueueId: {
    paramsSchema: z.ZodObject<{
        queueId: z.ZodUUID;
    }, z.z.core.$strip>;
};
export declare const lookupSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
}, z.z.core.$strip>;
export type LookupSchema = z.infer<typeof lookupSchema>;
//# sourceMappingURL=lookup.zod.d.ts.map