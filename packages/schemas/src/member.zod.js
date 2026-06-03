import z from "zod";
export const changeMemberRoleInput = {
    paramsSchema: z.object({
        roleId: z.uuid(),
        userId: z.uuid(),
    }),
};
export const changeMemberQueueInput = {
    paramsSchema: z.object({
        queueId: z.uuid(),
        userId: z.uuid(),
    }),
};
//# sourceMappingURL=member.zod.js.map