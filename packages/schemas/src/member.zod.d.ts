import z from "zod";
export declare const changeMemberRoleInput: {
    paramsSchema: z.ZodObject<{
        roleId: z.ZodUUID;
        userId: z.ZodUUID;
    }, z.z.core.$strip>;
};
export declare const changeMemberQueueInput: {
    paramsSchema: z.ZodObject<{
        queueId: z.ZodUUID;
        userId: z.ZodUUID;
    }, z.z.core.$strip>;
};
export type ChangeMemberRoleInput = z.infer<typeof changeMemberRoleInput.paramsSchema>;
export type ChangeMemberQueueInput = z.infer<typeof changeMemberQueueInput.paramsSchema>;
//# sourceMappingURL=member.zod.d.ts.map